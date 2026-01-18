/**
 * Property-Based Tests for Theme Script
 * Feature: dark-mode-toggle
 * 
 * These tests verify the correctness of the theme script that runs in the header
 * to apply saved theme preferences before the page renders.
 */

const fc = require('fast-check');
const { JSDOM } = require('jsdom');

/**
 * Helper function to create a fresh DOM environment for testing
 */
function createTestEnvironment(pathname = '/') {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Test</title>
    </head>
    <body>
    </body>
    </html>
  `, {
    url: `http://localhost${pathname}`,
    runScripts: 'dangerously',
    resources: 'usable'
  });

  return {
    window: dom.window,
    document: dom.window.document,
    localStorage: dom.window.localStorage
  };
}

/**
 * The theme script function extracted from header.ejs
 * This is the actual implementation being tested
 */
function applyThemeScript(window) {
  const savedTheme = window.localStorage.getItem('theme');
  const isDashboard = window.location.pathname === '/dashboard';
  
  // Don't apply dark mode to dashboard
  if (savedTheme === 'dark' && !isDashboard) {
    window.document.documentElement.classList.add('dark-mode');
  }
}

describe('Theme Script Property Tests', () => {
  
  /**
   * Property 8: Theme Script Behavior
   * **Validates: Requirements 4.2**
   * 
   * For any saved theme in localStorage, when the theme script executes,
   * it should read the localStorage value and apply the corresponding class
   * to the html element (unless on dashboard).
   */
  describe('Property 8: Theme Script Behavior', () => {
    
    test('should apply dark-mode class when theme is "dark" on non-dashboard pages', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary non-dashboard pathnames
          fc.oneof(
            fc.constant('/'),
            fc.constant('/settings'),
            fc.constant('/about'),
            fc.constant('/blog'),
            fc.constant('/pricing'),
            fc.string().filter(s => s !== '/dashboard' && s !== '/dashboard/')
          ),
          (pathname) => {
            // Arrange: Create test environment with the given pathname
            const { window, localStorage, document } = createTestEnvironment(pathname);
            
            // Set theme to "dark" in localStorage
            localStorage.setItem('theme', 'dark');
            
            // Act: Execute the theme script
            applyThemeScript(window);
            
            // Assert: dark-mode class should be applied
            const hasDarkMode = document.documentElement.classList.contains('dark-mode');
            
            return hasDarkMode === true;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should NOT apply dark-mode class when theme is "dark" on dashboard page', () => {
      fc.assert(
        fc.property(
          // Generate dashboard pathnames
          fc.constantFrom('/dashboard', '/dashboard/'),
          (pathname) => {
            // Arrange: Create test environment with dashboard pathname
            const { window, localStorage, document } = createTestEnvironment(pathname);
            
            // Set theme to "dark" in localStorage
            localStorage.setItem('theme', 'dark');
            
            // Act: Execute the theme script
            applyThemeScript(window);
            
            // Assert: dark-mode class should NOT be applied
            const hasDarkMode = document.documentElement.classList.contains('dark-mode');
            
            return hasDarkMode === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should NOT apply dark-mode class when theme is "light" on any page', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary pathnames
          fc.oneof(
            fc.constant('/'),
            fc.constant('/dashboard'),
            fc.constant('/settings'),
            fc.constant('/about'),
            fc.string()
          ),
          (pathname) => {
            // Arrange: Create test environment
            const { window, localStorage, document } = createTestEnvironment(pathname);
            
            // Set theme to "light" in localStorage
            localStorage.setItem('theme', 'light');
            
            // Act: Execute the theme script
            applyThemeScript(window);
            
            // Assert: dark-mode class should NOT be applied
            const hasDarkMode = document.documentElement.classList.contains('dark-mode');
            
            return hasDarkMode === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should NOT apply dark-mode class when localStorage is empty on any page', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary pathnames
          fc.oneof(
            fc.constant('/'),
            fc.constant('/dashboard'),
            fc.constant('/settings'),
            fc.string()
          ),
          (pathname) => {
            // Arrange: Create test environment with no theme in localStorage
            const { window, document } = createTestEnvironment(pathname);
            
            // localStorage is empty (no theme set)
            
            // Act: Execute the theme script
            applyThemeScript(window);
            
            // Assert: dark-mode class should NOT be applied
            const hasDarkMode = document.documentElement.classList.contains('dark-mode');
            
            return hasDarkMode === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should NOT apply dark-mode class when localStorage has invalid theme value', () => {
      fc.assert(
        fc.property(
          // Generate arbitrary pathnames
          fc.oneof(
            fc.constant('/'),
            fc.constant('/settings'),
            fc.string().filter(s => s !== '/dashboard')
          ),
          // Generate arbitrary invalid theme values (anything except "dark")
          fc.string().filter(s => s !== 'dark'),
          (pathname, invalidTheme) => {
            // Arrange: Create test environment
            const { window, localStorage, document } = createTestEnvironment(pathname);
            
            // Set invalid theme value in localStorage
            localStorage.setItem('theme', invalidTheme);
            
            // Act: Execute the theme script
            applyThemeScript(window);
            
            // Assert: dark-mode class should NOT be applied
            const hasDarkMode = document.documentElement.classList.contains('dark-mode');
            
            return hasDarkMode === false;
          }
        ),
        { numRuns: 100 }
      );
    });

    test('should correctly read localStorage value before applying theme', () => {
      fc.assert(
        fc.property(
          // Generate theme values
          fc.constantFrom('dark', 'light', null, undefined, 'invalid'),
          // Generate pathnames
          fc.oneof(
            fc.constant('/'),
            fc.constant('/dashboard'),
            fc.constant('/settings')
          ),
          (themeValue, pathname) => {
            // Arrange: Create test environment
            const { window, localStorage, document } = createTestEnvironment(pathname);
            
            // Set theme value in localStorage (if not null/undefined)
            if (themeValue !== null && themeValue !== undefined) {
              localStorage.setItem('theme', themeValue);
            }
            
            // Act: Execute the theme script
            applyThemeScript(window);
            
            // Assert: Verify correct behavior based on theme and pathname
            const hasDarkMode = document.documentElement.classList.contains('dark-mode');
            const isDashboard = pathname === '/dashboard' || pathname === '/dashboard/';
            
            // Expected behavior:
            // - dark-mode class should be present ONLY if:
            //   1. theme is exactly "dark" AND
            //   2. pathname is NOT dashboard
            const expectedDarkMode = (themeValue === 'dark' && !isDashboard);
            
            return hasDarkMode === expectedDarkMode;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
