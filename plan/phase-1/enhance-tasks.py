#!/usr/bin/env python3
"""
Enhance all task files with expanded requirements and test cases/user stories
"""

import re
from pathlib import Path
from typing import Dict, List

def get_task_details_from_exec_order():
    """Parse execution-order.md to get detailed task information"""
    exec_order_path = Path(__file__).parent / "execution-order.md"
    with open(exec_order_path, 'r') as f:
        content = f.read()
    
    tasks = {}
    lines = content.split('\n')
    current_task_id = None
    current_task = None
    
    for line in lines:
        # Match task headers
        task_match = re.match(r'^(\d+)\.\s+\*\*\[(T-\d+)\]\s+(.+?)\*\*', line)
        if task_match:
            if current_task_id:
                tasks[current_task_id] = current_task
            task_num = int(task_match.group(1))
            task_id = task_match.group(2)
            task_title = task_match.group(3)
            current_task_id = task_id
            current_task = {
                'number': task_num,
                'id': task_id,
                'title': task_title,
                'actions': [],
                'tests': []
            }
            continue
        
        if not current_task:
            continue
        
        # Collect actions
        if line.strip().startswith('- ') and 'Actions:' not in line and 'Tests:' not in line:
            action = line.strip()[2:]
            if action and not action.startswith('Depends on'):
                current_task['actions'].append(action)
        
        # Collect tests
        if '- Tests:' in line or 'Tests:' in line:
            continue
        if current_task and 'tests' in str(current_task):
            # Look for test-related lines
            if 'test' in line.lower() or 'spec' in line.lower() or 'assert' in line.lower():
                current_task['tests'].append(line.strip())
    
    if current_task_id:
        tasks[current_task_id] = current_task
    
    return tasks

def generate_expanded_requirements(task_id: str, task_title: str, actions: List[str], tests: List[str]) -> str:
    """Generate expanded requirements based on task type"""
    title_lower = task_title.lower()
    
    requirements = []
    
    # Common requirements
    requirements.append({
        'title': 'Code Quality',
        'items': [
            'All code must follow TypeScript best practices',
            'All code must pass ESLint without errors',
            'All code must be properly typed (no `any` types unless absolutely necessary)',
            'All functions must have appropriate JSDoc/TSDoc comments'
        ]
    })
    
    # Task-specific requirements
    if 'install' in title_lower or 'dependency' in title_lower:
        requirements.append({
            'title': 'Dependency Installation',
            'items': [
                'All packages must be installed successfully in `node_modules`',
                '`package.json` must be updated with correct version ranges',
                '`package-lock.json` must be updated and committed',
                'No peer dependency warnings that would cause runtime issues',
                'All npm scripts must be functional and executable'
            ]
        })
    
    if 'schema' in title_lower or 'zod' in title_lower:
        requirements.append({
            'title': 'Schema Validation',
            'items': [
                'All schemas must properly validate required fields',
                'Optional fields must be handled correctly',
                'Default values must be applied when appropriate',
                'Type inference must work correctly for all schemas',
                'Invalid data must throw descriptive validation errors'
            ]
        })
    
    if 'component' in title_lower or 'layout' in title_lower:
        requirements.append({
            'title': 'Component Requirements',
            'items': [
                'Component must accept all required props with proper TypeScript types',
                'Component must handle optional props gracefully',
                'Component must be accessible (ARIA labels, semantic HTML)',
                'Component must be responsive and work on mobile/tablet/desktop',
                'Component must accept and apply `className` prop for styling flexibility'
            ]
        })
    
    if 'test' in title_lower and 'configure' in title_lower:
        requirements.append({
            'title': 'Testing Configuration',
            'items': [
                'Vitest must be configured to work with Next.js and React',
                'Test files must be discoverable in `test/` or `__tests__/` directories',
                'TypeScript must be properly configured for test files',
                'Path aliases (`@/*`) must work in test files',
                'Test setup file must be properly imported'
            ]
        })
    
    if 'loader' in title_lower or 'load' in title_lower:
        requirements.append({
            'title': 'Data Loading',
            'items': [
                'Function must work in Node.js environment (server-side only)',
                'Function must handle file system errors gracefully',
                'Function must validate loaded data against schemas',
                'Function must return properly typed data',
                'Function must handle missing files or directories appropriately'
            ]
        })
    
    if 'route' in title_lower or 'page' in title_lower:
        requirements.append({
            'title': 'Route Requirements',
            'items': [
                'Route must be a Next.js server component (async function)',
                'Route must handle dynamic parameters correctly',
                'Route must load and validate data before rendering',
                'Route must handle errors and display appropriate error states',
                'Route must render all required components in correct order'
            ]
        })
    
    if 'theme' in title_lower:
        requirements.append({
            'title': 'Theme System',
            'items': [
                'Theme provider must correctly select and provide theme',
                'Theme hook must throw error when used outside provider',
                'Theme must fallback to default when invalid theme key provided',
                'Theme classes must be properly applied to components',
                'Theme must support class composition with custom className props'
            ]
        })
    
    if 'script' in title_lower or 'cli' in title_lower:
        requirements.append({
            'title': 'CLI Script Requirements',
            'items': [
                'Script must parse command-line arguments correctly',
                'Script must validate inputs before processing',
                'Script must handle file I/O errors gracefully',
                'Script must provide clear error messages',
                'Script must create directories if they do not exist'
            ]
        })
    
    if 'document' in title_lower or 'docs' in title_lower:
        requirements.append({
            'title': 'Documentation Requirements',
            'items': [
                'Documentation must be clear and comprehensive',
                'Documentation must include code examples where appropriate',
                'Documentation must be properly formatted in Markdown',
                'Documentation must be committed to git',
                'Documentation must follow project documentation standards'
            ]
        })
    
    # Build requirements text
    req_text = ""
    for req_group in requirements:
        req_text += f"\n- [ ] **{req_group['title']}**:\n"
        for item in req_group['items']:
            req_text += f"  - [ ] {item}\n"
    
    return req_text

def generate_test_cases(task_id: str, task_title: str, actions: List[str], tests: List[str]) -> str:
    """Generate test cases and user stories"""
    title_lower = task_title.lower()
    
    test_cases = []
    
    # Common test cases
    test_cases.append({
        'type': 'Unit Test',
        'description': 'Code compiles without TypeScript errors',
        'acceptance': '`npm run build` completes successfully with no type errors'
    })
    
    test_cases.append({
        'type': 'Lint Test',
        'description': 'Code passes ESLint validation',
        'acceptance': '`npm run lint` completes with no errors or warnings'
    })
    
    # Task-specific test cases
    if 'install' in title_lower or 'dependency' in title_lower:
        test_cases.append({
            'type': 'Integration Test',
            'description': 'All packages are installed and accessible',
            'acceptance': 'Can import all installed packages in a test file without errors'
        })
        test_cases.append({
            'type': 'Functional Test',
            'description': 'npm scripts are functional',
            'acceptance': '`npm test` and `npm run test:watch` commands execute without errors'
        })
    
    if 'schema' in title_lower or 'zod' in title_lower:
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Valid data passes schema validation',
            'acceptance': 'Schema.parse() succeeds with valid input data'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Invalid data throws validation errors',
            'acceptance': 'Schema.parse() throws ZodError with descriptive messages for invalid input'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Optional fields are handled correctly',
            'acceptance': 'Schema accepts data with optional fields missing'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Default values are applied',
            'acceptance': 'Schema applies default values when fields are missing'
        })
    
    if 'component' in title_lower or 'layout' in title_lower:
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Component renders without errors',
            'acceptance': 'Component renders successfully with required props'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Component displays expected content',
            'acceptance': 'Component renders expected text, images, or elements based on props'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Component handles optional props',
            'acceptance': 'Component renders correctly when optional props are omitted'
        })
        test_cases.append({
            'type': 'Accessibility Test',
            'description': 'Component is accessible',
            'acceptance': 'Component has proper ARIA labels and semantic HTML structure'
        })
    
    if 'test' in title_lower and 'configure' in title_lower:
        test_cases.append({
            'type': 'Configuration Test',
            'description': 'Vitest can discover and run test files',
            'acceptance': '`npm test` finds and executes test files in `test/` directory'
        })
        test_cases.append({
            'type': 'Integration Test',
            'description': 'Test setup file is loaded',
            'acceptance': 'Test setup file imports are executed before tests run'
        })
    
    if 'loader' in title_lower or 'load' in title_lower:
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Loader reads and parses data correctly',
            'acceptance': 'loadRestaurant() returns valid config and menu objects'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Loader validates data against schemas',
            'acceptance': 'loadRestaurant() throws error if data does not match schemas'
        })
        test_cases.append({
            'type': 'Error Handling Test',
            'description': 'Loader handles missing files',
            'acceptance': 'loadRestaurant() throws descriptive error when restaurant data files are missing'
        })
    
    if 'route' in title_lower or 'page' in title_lower:
        test_cases.append({
            'type': 'Integration Test',
            'description': 'Route renders without errors',
            'acceptance': 'Page component renders successfully with mocked data'
        })
        test_cases.append({
            'type': 'Integration Test',
            'description': 'Route displays expected content',
            'acceptance': 'Page displays restaurant name, menu items, and other expected content'
        })
    
    if 'theme' in title_lower:
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Theme provider provides correct theme',
            'acceptance': 'useTheme() returns correct theme object for given theme key'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Theme hook throws when used outside provider',
            'acceptance': 'useTheme() throws error with descriptive message when used outside RestaurantThemeProvider'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Theme falls back to default',
            'acceptance': 'RestaurantThemeProvider uses default theme when invalid theme key provided'
        })
    
    if 'script' in title_lower or 'cli' in title_lower:
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Script processes input correctly',
            'acceptance': 'Script reads input file and processes data as expected'
        })
        test_cases.append({
            'type': 'Unit Test',
            'description': 'Script validates output',
            'acceptance': 'Script validates generated output against schema before writing'
        })
        test_cases.append({
            'type': 'Integration Test',
            'description': 'Script writes output file',
            'acceptance': 'Script creates output file with valid JSON content'
        })
    
    # Add tests from execution-order.md
    for test in tests:
        if test.strip() and not test.strip().startswith('-'):
            test_cases.append({
                'type': 'Unit Test',
                'description': test.strip(),
                'acceptance': 'Test passes and validates expected behavior'
            })
    
    # Build test cases text
    test_text = "\n## Test Cases / User Stories\n\n"
    test_text += "The following test cases must be implemented and passing for this task to be considered complete:\n\n"
    
    for i, test_case in enumerate(test_cases, 1):
        test_text += f"### Test Case {i}: {test_case['description']}\n\n"
        test_text += f"**Type**: {test_case['type']}\n\n"
        test_text += f"**Acceptance Criteria**: {test_case['acceptance']}\n\n"
        test_text += f"**User Story**: As a developer, I want {test_case['description'].lower()} so that {test_case['acceptance'].lower()}.\n\n"
        test_text += "---\n\n"
    
    return test_text

def enhance_task_file(task_file_path: Path, task_details: Dict):
    """Enhance a single task file"""
    with open(task_file_path, 'r') as f:
        content = f.read()
    
    task_id = task_details.get('id', '')
    task_title = task_details.get('title', '')
    actions = task_details.get('actions', [])
    tests = task_details.get('tests', [])
    
    # Generate expanded requirements
    expanded_reqs = generate_expanded_requirements(task_id, task_title, actions, tests)
    
    # Generate test cases
    test_cases = generate_test_cases(task_id, task_title, actions, tests)
    
    # Find and replace Specific Requirements section
    req_pattern = r'(### Specific Requirements\n\n)(.*?)(\n### Error Handling)'
    req_replacement = r'\1- [ ] All requirements from execution-order.md must be met' + expanded_reqs + r'\n\3'
    
    if re.search(req_pattern, content, re.DOTALL):
        content = re.sub(req_pattern, req_replacement, content, flags=re.DOTALL)
    else:
        # Insert after Specific Requirements if pattern doesn't match exactly
        content = content.replace(
            '### Specific Requirements\n\n- [ ] All requirements from execution-order.md must be met',
            '### Specific Requirements\n\n- [ ] All requirements from execution-order.md must be met' + expanded_reqs
        )
    
    # Insert test cases before Definition of Done (only if not already present)
    if '## Test Cases / User Stories' not in content:
        dod_pattern = r'(## Related Tasks.*?\n\n)(## Definition of Done)'
        if re.search(dod_pattern, content, re.DOTALL):
            content = re.sub(dod_pattern, r'\1' + test_cases + r'\2', content, flags=re.DOTALL)
        else:
            # Fallback: insert before Definition of Done
            content = content.replace('## Definition of Done', test_cases + '\n## Definition of Done')
    
    # Enhance Definition of Done to include test verification
    # Check if test verification already exists
    if '**Test Verification Requirements**:' not in content:
        dod_enhancement = """
**Test Verification Requirements**:
- [ ] All test cases listed above must be implemented
- [ ] All test cases must pass (`npm test` completes successfully)
- [ ] Test coverage must be maintained or improved
- [ ] No test warnings or errors should be present
- [ ] All user stories must be validated through passing tests

"""
        
        # Add test verification to Definition of Done
        # Insert after the Definition of Done quote
        dod_pattern = r'(\*\*Definition of Done\*\*:\s*"[^"]+")(\n\n)'
        if re.search(dod_pattern, content):
            content = re.sub(
                dod_pattern,
                r'\1\n' + dod_enhancement.strip() + r'\2',
                content
            )
        elif '**Definition of Done**:' in content:
            # Fallback: insert after Definition of Done quote if it exists
            content = re.sub(
                r'(\*\*Definition of Done\*\*:\s*")([^"]+)(")(\n\n)',
                r'\1\2\3\n' + dod_enhancement.strip() + r'\4',
                content
            )
    
    return content

def main():
    """Main function to enhance all task files"""
    tasks_dir = Path(__file__).parent / "tasks"
    task_details = get_task_details_from_exec_order()
    
    print(f"Found {len(task_details)} tasks in execution-order.md")
    
    # Map task numbers to task IDs
    task_files = sorted(tasks_dir.glob("*.md"))
    
    for task_file in task_files:
        task_num = int(task_file.stem)
        
        # Find matching task in details
        matching_task = None
        for task_id, details in task_details.items():
            if details['number'] == task_num:
                matching_task = details
                break
        
        if not matching_task:
            print(f"Warning: No details found for task {task_num}")
            continue
        
        print(f"Enhancing {task_file.name}: {matching_task['title']}")
        
        enhanced_content = enhance_task_file(task_file, matching_task)
        
        with open(task_file, 'w') as f:
            f.write(enhanced_content)
    
    print(f"\nEnhanced {len(task_files)} task files")

if __name__ == '__main__':
    main()

