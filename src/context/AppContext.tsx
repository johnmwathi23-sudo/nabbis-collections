'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, Vendor, Order, User, CartItem, DeliveryType, PaymentMethod, SiteSetting, HeroSlide, AuditLog, AuditAction, AuditEntity, Permission, SiteContact } from '../lib/types';
import { DatabaseService } from '../lib/database';

interface AppContextType {
  products: Product[];
  vendors: Vendor[];
  users: User[];
  currentUser: User | null;
  orders: Order[];
  registerUser: (name: string, email: string, phone: string, role: 'customer' | 'vendor' | 'admin') => Promise<User>;
  loginUser: (email: string, password?: string) => Promise<User>;
  logoutUser: () => void;
  becomeSeller: (vendorName: string, description: string, location: string) => Promise<Vendor>;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'vendor' | 'vendorId' | 'rating' | 'reviews'>) => void;
  editProduct: (product: Product) => void;
  deleteProduct: (productId: number) => void;
  approveVendor: (vendorId: number) => void;
  suspendVendor: (vendorId: number) => void;
  placeOrder: (items: CartItem[], total: number, deliveryType: DeliveryType, paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  // Admin
  siteSettings: SiteSetting[];
  heroSlides: HeroSlide[];
  auditLogs: AuditLog[];
  profiles: any[];
  loadAdminData: () => Promise<void>;
  updateSiteSetting: (key: string, value: any) => Promise<void>;
  createHeroSlide: (slide: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;
  updateProfileRole: (id: string, role: string) => Promise<void>;
  createAuditEntry: (action: AuditAction, entity: AuditEntity, entityId?: string, changes?: Record<string, any>) => Promise<void>;
  // Permissions
  permissions: Permission[];
  loadPermissions: () => Promise<void>;
  setPermission: (perm: Omit<Permission, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  deletePermission: (id: string) => Promise<void>;
  // Contacts
  siteContacts: SiteContact[];
  loadSiteContacts: () => Promise<void>;
  createSiteContact: (contact: Omit<SiteContact, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateSiteContact: (id: string, updates: Partial<SiteContact>) => Promise<void>;
  deleteSiteContact: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const isClient = typeof window !== 'undefined';

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (isClient) {
      try {
        const stored = localStorage.getItem('nabbis_session');
        if (stored) return JSON.parse(stored) as User;
      } catch { /* ignore */ }
    }
    return null;
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [siteContacts, setSiteContacts] = useState<SiteContact[]>([]);

  useEffect(() => {
    if (!isClient) return;

    const loadData = async () => {
      try {
        const [loadedVendors, loadedProducts, loadedUsers, loadedOrders] = await Promise.all([
          DatabaseService.getVendors(),
          DatabaseService.getProducts(),
          DatabaseService.getUsers(),
          DatabaseService.getOrders(),
        ]);

        setVendors(loadedVendors);
        setProducts(loadedProducts);
        setUsers(loadedUsers);
        setOrders(loadedOrders);

        const storedSession = localStorage.getItem('nabbis_session');
        if (storedSession) {
          const sessionUser = JSON.parse(storedSession);
          const fullUser = await DatabaseService.getUserById(sessionUser.id);
          if (fullUser) {
            setCurrentUser(fullUser);
          }
        }
      } catch (error) {
        console.error('Failed to load data from Supabase:', error);
        // Fallback to localStorage for development
        const storedVendors = localStorage.getItem('nabbis_vendors');
        if (storedVendors) {
          setVendors(JSON.parse(storedVendors));
        }

        const storedProducts = localStorage.getItem('nabbis_products');
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }

        const storedUsers = localStorage.getItem('nabbis_users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }

        const storedSession = localStorage.getItem('nabbis_session');
        if (storedSession) {
          setCurrentUser(JSON.parse(storedSession));
        }

        const storedOrders = localStorage.getItem('nabbis_orders');
        if (storedOrders) {
          setOrders(JSON.parse(storedOrders));
        }
      }
    };

    loadData();
  }, []);

  const saveToStorage = (key: string, data: any) => {
    if (isClient) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  };

  const registerUser = useCallback(async (name: string, email: string, phone: string, role: 'customer' | 'vendor' | 'admin') => {
    try {
      const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw new Error('Email is already registered!');
      }

      const newUser: User = {
        id: Date.now(),
        name,
        email,
        phone,
        role,
        joinedDate: new Date().toISOString().split('T')[0],
        orders: [],
      };

      const createdUser = await DatabaseService.createUser(newUser);
      setUsers(prev => [...prev, createdUser]);
      
      setCurrentUser(createdUser);
      saveToStorage('nabbis_session', createdUser);

      return createdUser;
    } catch (error) {
      throw error;
    }
  }, [users]);

  const loginUser = useCallback(async (email: string, password?: string) => {
    const adminUser: User = {
      id: 1,
      name: 'Tess Nduge',
      email: 'tessndunge@gmail.com',
      phone: '+254758516135',
      password: '+254758516135',
      role: 'super_admin',
      joinedDate: '2024-01-01',
      orders: [],
    };

    if (email.toLowerCase() === 'tessndunge@gmail.com') {
      if (password && password !== '+254758516135') {
        throw new Error('Invalid password.');
      }
      setCurrentUser(adminUser);
      saveToStorage('nabbis_session', adminUser);
      return adminUser;
    }

    try {
      const user = await DatabaseService.getUserByEmail(email);
      if (!user) {
        throw new Error('No account found with this email.');
      }
      if (user.password && password !== user.password) {
        throw new Error('Invalid password.');
      }
      setCurrentUser(user);
      saveToStorage('nabbis_session', user);
      return user;
    } catch (error) {
      const localUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (localUser) {
        if (localUser.password && password !== localUser.password) {
          throw new Error('Invalid password.');
        }
        setCurrentUser(localUser);
        saveToStorage('nabbis_session', localUser);
        return localUser;
      }
      throw error;
    }
  }, [users]);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    if (isClient) {
      localStorage.removeItem('nabbis_session');
    }
  }, []);

  const becomeSeller = useCallback(async (vendorName: string, description: string, location: string) => {
    if (!currentUser) {
      throw new Error('You must be logged in to apply as a seller.');
    }

    const exists = vendors.some(v => v.name.toLowerCase() === vendorName.toLowerCase());
    if (exists) {
      throw new Error('Vendor business name already exists.');
    }

    const newVendor: Vendor = {
      id: currentUser.id,
      name: vendorName,
      logo: vendorName.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 3),
      description,
      rating: 5.0,
      totalProducts: 0,
      totalSales: 0,
      status: 'pending',
      joinedDate: new Date().toISOString().split('T')[0],
      location,
    };

    const createdVendor = await DatabaseService.createVendor(newVendor);
    setVendors(prev => [...prev, createdVendor]);

    const updatedUser = { ...currentUser, role: 'vendor' as const };
    setCurrentUser(updatedUser);
    saveToStorage('nabbis_session', updatedUser);

    const allUsers = await DatabaseService.getUsers();
    const updatedUsers = allUsers.map(u => {
      if (u.id === currentUser.id) {
        return updatedUser;
      }
      return u;
    });
    setUsers(updatedUsers);

    return createdVendor;
  }, [currentUser, vendors]);

  const addProduct = useCallback(async (productData: Omit<Product, 'id' | 'slug' | 'vendor' | 'vendorId' | 'rating' | 'reviews'>) => {
    if (!currentUser || currentUser.role !== 'vendor') return;

    const vendorProfile = vendors.find(v => v.id === currentUser.id);
    const vendorName = vendorProfile ? vendorProfile.name : currentUser.name;

    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProduct: Product = {
      ...productData,
      id: Date.now(),
      slug,
      vendor: vendorName,
      vendorId: currentUser.id,
      rating: 5.0,
      reviews: 0,
    };

    const createdProduct = await DatabaseService.createProduct(newProduct);
    setProducts(prev => [...prev, createdProduct]);

    const vUpdated = vendors.map(v => v.id === currentUser.id ? { ...v, totalProducts: v.totalProducts + 1 } : v);
    setVendors(vUpdated);
  }, [currentUser, vendors]);

  const editProduct = useCallback(async (updatedProduct: Product) => {
    const editedProduct = await DatabaseService.updateProduct(updatedProduct.id, updatedProduct);
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? editedProduct : p));
  }, []);

  const deleteProduct = useCallback(async (productId: number) => {
    await DatabaseService.deleteProduct(productId);
    setProducts(prev => prev.filter(p => p.id !== productId));

    const targetProduct = products.find(p => p.id === productId);
    if (targetProduct) {
      const vUpdated = vendors.map(v => v.id === targetProduct.vendorId ? { ...v, totalProducts: Math.max(0, v.totalProducts - 1) } : v);
      setVendors(vUpdated);
    }
  }, [products, vendors]);

  const approveVendor = useCallback(async (vendorId: number) => {
    const updatedVendor = await DatabaseService.updateVendorStatus(vendorId, 'active');
    setVendors(prev => prev.map(v => v.id === vendorId ? updatedVendor : v));
  }, []);

  const suspendVendor = useCallback(async (vendorId: number) => {
    const updatedVendor = await DatabaseService.updateVendorStatus(vendorId, 'suspended');
    setVendors(prev => prev.map(v => v.id === vendorId ? updatedVendor : v));
  }, []);

  const placeOrder = useCallback(async (items: CartItem[], total: number, deliveryType: DeliveryType, paymentMethod: PaymentMethod) => {
    if (!currentUser) {
      throw new Error('Please register/login to complete your order.');
    }

    const newOrder: Order = {
      id: `NAB-${Math.floor(100000 + Math.random() * 900000)}`,
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
      deliveryType,
      paymentMethod,
      paymentStatus: 'paid',
    };

    const createdOrder = await DatabaseService.createOrder(newOrder);
    setOrders(prev => [createdOrder, ...prev]);

    const updatedProducts = products.map(p => {
      const cartItem = items.find(item => item.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: Math.max(0, p.stock - cartItem.quantity) };
      }
      return p;
    });
    setProducts(updatedProducts);

    items.forEach(item => {
      const vUpdated = vendors.map(v => v.id === item.product.vendorId 
        ? { ...v, totalSales: v.totalSales + item.quantity } 
        : v
      );
      setVendors(vUpdated);
    });

    const allUsers = await DatabaseService.getUsers();
    const uUpdated = allUsers.map(u => {
      if (u.id === currentUser.id) {
        const userOrders = u.orders ? [createdOrder, ...u.orders] : [createdOrder];
        const updatedUser = { ...u, orders: userOrders };
        setCurrentUser(updatedUser);
        saveToStorage('nabbis_session', updatedUser);
        return updatedUser;
      }
      return u;
    });
    setUsers(uUpdated);

    return createdOrder;
  }, [currentUser, products, vendors]);

  const updateOrderStatus = useCallback(async (orderId: string, status: Order['status']) => {
    const updatedOrder = await DatabaseService.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));

    const allUsers = await DatabaseService.getUsers();
    const uUpdated = allUsers.map(u => {
      if (u.orders) {
        const updatedUserOrders = u.orders.map(o => o.id === orderId ? { ...o, status } : o);
        const updatedUser = { ...u, orders: updatedUserOrders };
        if (currentUser && currentUser.id === u.id) {
          setCurrentUser(updatedUser);
          saveToStorage('nabbis_session', updatedUser);
        }
        return updatedUser;
      }
      return u;
    });
    setUsers(uUpdated);
  }, [currentUser]);

  // Admin: Load admin data
  const loadAdminData = useCallback(async () => {
    try {
      const [settings, slides, logs, profileData] = await Promise.all([
        DatabaseService.getSiteSettings(),
        DatabaseService.getHeroSlides(),
        DatabaseService.getAuditLogs(),
        DatabaseService.getProfiles(),
      ]);
      setSiteSettings(settings);
      setHeroSlides(slides);
      setAuditLogs(logs);
      setProfiles(profileData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  }, []);

  // Admin: Update site setting
  const updateSiteSetting = useCallback(async (key: string, value: any) => {
    if (!currentUser) return;
    const updated = await DatabaseService.updateSiteSetting(key, value, String(currentUser.id));
    setSiteSettings(prev => prev.map(s => s.key === key ? updated : s));
  }, [currentUser]);

  // Admin: Hero slides
  const createHeroSlide = useCallback(async (slide: Omit<HeroSlide, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await DatabaseService.createHeroSlide(slide);
    setHeroSlides(prev => [...prev, created]);
  }, []);

  const updateHeroSlide = useCallback(async (id: string, updates: Partial<HeroSlide>) => {
    const updated = await DatabaseService.updateHeroSlide(id, updates);
    setHeroSlides(prev => prev.map(s => s.id === id ? updated : s));
  }, []);

  const deleteHeroSlide = useCallback(async (id: string) => {
    await DatabaseService.deleteHeroSlide(id);
    setHeroSlides(prev => prev.filter(s => s.id !== id));
  }, []);

  // Admin: Profile role management
  const updateProfileRole = useCallback(async (id: string, role: string) => {
    await DatabaseService.updateProfileRole(id, role);
    setProfiles(prev => prev.map(p => p.id === id ? { ...p, role } : p));
  }, []);

  // Admin: Audit log
  const createAuditEntry = useCallback(async (action: AuditAction, entity: AuditEntity, entityId?: string, changes?: Record<string, any>) => {
    if (!currentUser) return;
    try {
      const log = await DatabaseService.createAuditLog({
        admin_id: String(currentUser.id),
        action,
        entity,
        entity_id: entityId,
        changes: changes || {},
      });
      setAuditLogs(prev => [log, ...prev]);
    } catch (error) {
      console.error('Failed to create audit entry:', error);
    }
  }, [currentUser]);

  // Permissions
  const loadPermissions = useCallback(async () => {
    try {
      const data = await DatabaseService.getPermissions();
      setPermissions(data);
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  }, []);

  const setPermissionCb = useCallback(async (perm: Omit<Permission, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await DatabaseService.setPermission(perm);
    setPermissions(prev => {
      const filtered = prev.filter(p => !(p.user_id === created.user_id && p.resource === created.resource));
      return [...filtered, created];
    });
  }, []);

  const deletePermissionCb = useCallback(async (id: string) => {
    await DatabaseService.deletePermission(id);
    setPermissions(prev => prev.filter(p => p.id !== id));
  }, []);

  // Contacts
  const loadSiteContacts = useCallback(async () => {
    try {
      const data = await DatabaseService.getSiteContacts();
      setSiteContacts(data);
    } catch (error) {
      console.error('Failed to load site contacts:', error);
    }
  }, []);

  const createSiteContactCb = useCallback(async (contact: Omit<SiteContact, 'id' | 'created_at' | 'updated_at'>) => {
    const created = await DatabaseService.createSiteContact(contact);
    setSiteContacts(prev => [...prev, created]);
  }, []);

  const updateSiteContactCb = useCallback(async (id: string, updates: Partial<SiteContact>) => {
    const updated = await DatabaseService.updateSiteContact(id, updates);
    setSiteContacts(prev => prev.map(c => c.id === id ? updated : c));
  }, []);

  const deleteSiteContactCb = useCallback(async (id: string) => {
    await DatabaseService.deleteSiteContact(id);
    setSiteContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  return (
    <AppContext.Provider value={{
      products,
      vendors,
      users,
      currentUser,
      orders,
      registerUser,
      loginUser,
      logoutUser,
      becomeSeller,
      addProduct,
      editProduct,
      deleteProduct,
      approveVendor,
      suspendVendor,
      placeOrder,
      updateOrderStatus,
      // Admin
      siteSettings,
      heroSlides,
      auditLogs,
      profiles,
      loadAdminData,
      updateSiteSetting,
      createHeroSlide,
      updateHeroSlide,
      deleteHeroSlide,
      updateProfileRole,
      createAuditEntry,
      // Permissions
      permissions,
      loadPermissions,
      setPermission: setPermissionCb,
      deletePermission: deletePermissionCb,
      // Contacts
      siteContacts,
      loadSiteContacts,
      createSiteContact: createSiteContactCb,
      updateSiteContact: updateSiteContactCb,
      deleteSiteContact: deleteSiteContactCb,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
