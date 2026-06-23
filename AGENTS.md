# Development Agents

This document describes the development agents and workflows used in the Nabbis Collections project.

## Available Agents

### opencode
- **Purpose**: Main development agent for implementing features, fixing bugs, and managing the codebase
- **Capabilities**: Code generation, editing, testing, deployment, and project management
- **Tools**: File operations, bash commands, web search, web fetch, task management

### explore
- **Purpose**: Specialized agent for exploring codebases and finding files
- **Capabilities**: Fast file pattern matching, content search, code navigation
- **Use cases**: Finding specific classes, searching for keywords, exploring project structure

### general
- **Purpose**: General-purpose agent for complex research and multi-step tasks
- **Capabilities**: Parallel execution, complex problem solving, research
- **Use cases**: Multi-step development tasks, research, planning

## Development Workflow

### 1. Project Exploration
- Use `explore` agent to understand the codebase structure
- Search for specific components, files, and patterns
- Identify existing functionality and areas for improvement

### 2. Feature Implementation
- Use `opencode` agent for implementing new features
- Follow existing code conventions and patterns
- Write clean, maintainable code with minimal comments

### 3. Testing and Validation
- Use `opencode` agent to run linting and type checking
- Verify all changes work as expected
- Ensure code quality and maintainability

### 4. Deployment
- Use `opencode` agent to configure deployment pipelines
- Set up environment variables and CI/CD workflows
- Prepare the project for production

## Project Structure

### Key Directories

- `src/`: Source code
  - `lib/`: Shared types and utilities
  - `components/`: React components
  - `context/`: React context providers
  - `app/`: Next.js pages and routes

### Key Files

- `src/lib/types.ts`: TypeScript type definitions
- `src/lib/data.ts`: Initial data and utility functions
- `src/lib/supabase.ts`: Supabase client configuration
- `src/lib/database.ts`: Database service layer
- `src/context/AppContext.tsx`: Main application context
- `src/components/Button.tsx`: Button component
- `src/components/Navbar.tsx`: Navigation component

## Development Commands

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint linting
- `npm run typecheck`: Run TypeScript type checking
- `npm run deploy`: Deploy to Vercel
- `npm run deploy:prod`: Deploy to Vercel production

### Common Development Tasks

1. **Adding a new component**
   - Create component file in `src/components/`
   - Create corresponding CSS module
   - Import and use in appropriate pages

2. **Adding a new page**
   - Create page file in `src/app/`
   - Create corresponding CSS module
   - Add navigation links if needed

3. **Adding new data**
   - Update `src/lib/data.ts` with new products, categories, etc.
   - Ensure data follows existing structure

4. **Adding new functionality**
   - Update `src/lib/types.ts` if new types are needed
   - Update `src/context/AppContext.tsx` for new context features
   - Create API routes if needed in `src/app/api/`

## Best Practices

### Code Quality

- Follow existing code style and conventions
- Use TypeScript for type safety
- Write clean, readable code with minimal comments
- Use existing libraries and utilities

### Testing

- Run linting and type checking before committing
- Verify all changes work as expected
- Test edge cases and error conditions

### Deployment

- Configure environment variables properly
- Use CI/CD pipelines for automated testing and deployment
- Monitor deployment logs for errors

## Troubleshooting

### Common Issues

1. **Build errors**
   - Run `npm run lint` and `npm run typecheck`
   - Check for syntax errors and type mismatches

2. **Deployment failures**
   - Verify environment variables are set
   - Check deployment logs for specific errors
   - Ensure all dependencies are installed

3. **Database connection issues**
   - Verify Supabase configuration
   - Check network connectivity
   - Ensure environment variables are correct

## Support

For help with development or troubleshooting, refer to the project documentation or contact the development team.
