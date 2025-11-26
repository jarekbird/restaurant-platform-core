#!/usr/bin/env python3
"""
Fix test cases sections - remove duplicates and ensure proper structure
"""

import re
from pathlib import Path

def fix_task_file(task_file_path: Path):
    """Fix test cases sections in a task file"""
    with open(task_file_path, 'r') as f:
        content = f.read()
    
    original_content = content
    
    # Find the main "Test Cases / User Stories" section (should be before Definition of Done)
    # Keep only the one that appears right before "## Definition of Done"
    test_section_pattern = r'(## Test Cases / User Stories.*?)(?=\n## Definition of Done)'
    main_test_section_match = re.search(test_section_pattern, content, re.DOTALL)
    
    if main_test_section_match:
        main_test_section = main_test_section_match.group(1)
        
        # Remove ALL test case sections (including duplicates and embedded ones)
        # Remove embedded test cases from Testing section
        content = re.sub(
            r'(### Testing\n\n)(.*?)(\n### Documentation)',
            r'\1- [ ] Write appropriate tests if required\n- [ ] Run full test suite: `npm test`\n- [ ] Run type checking: `npm run build` (TypeScript check)\n- [ ] Run linting: `npm run lint`\n- [ ] **DO NOT manually test by running the server** - use automated tests instead\n- [ ] Ensure all affected functionality is covered by automated tests\n\3',
            content,
            flags=re.DOTALL
        )
        
        # Remove all "## Test Cases / User Stories" sections
        content = re.sub(
            r'## Test Cases / User Stories.*?(?=\n## |$)',
            '',
            content,
            flags=re.DOTALL
        )
        
        # Remove any orphaned test case items (test cases without the header)
        # Pattern: Test Case X: that appears before "## Test Cases / User Stories"
        # Find position of main test section
        main_test_pos = content.find('## Test Cases / User Stories')
        if main_test_pos > 0:
            # Remove orphaned test cases before the main section
            before_main = content[:main_test_pos]
            after_main = content[main_test_pos:]
            
            # Remove orphaned test cases from before_main
            before_main = re.sub(
                r'### Test Case \d+:.*?(?=\n---|\n## |$)',
                '',
                before_main,
                flags=re.DOTALL
            )
            # Remove empty lines and separators
            before_main = re.sub(r'\n{3,}', '\n\n', before_main)
            before_main = re.sub(r'---\s*\n\s*---', '---', before_main)
            
            content = before_main + after_main
        
        # Insert the main test section before Definition of Done
        content = re.sub(
            r'(## Related Tasks.*?\n\n)(## Definition of Done)',
            r'\1' + main_test_section + r'\n\n\2',
            content,
            flags=re.DOTALL
        )
        
        # Fix Definition of Done formatting
        content = re.sub(
            r'\*\*Definition of Done\*\*:\s*\n\s*"([^"]+)"',
            r'**Definition of Done**: "\1"',
            content
        )
        
        # Add test verification if missing
        if '**Test Verification Requirements**:' not in content:
            test_verification = """
**Test Verification Requirements**:
- [ ] All test cases listed above must be implemented
- [ ] All test cases must pass (`npm test` completes successfully)
- [ ] Test coverage must be maintained or improved
- [ ] No test warnings or errors should be present
- [ ] All user stories must be validated through passing tests

"""
            # Insert after Definition of Done quote
            content = re.sub(
                r'(\*\*Definition of Done\*\*:\s*"[^"]+")(\n\n)',
                r'\1' + test_verification + r'\2',
                content
            )
    
    if content != original_content:
        with open(task_file_path, 'w') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Main function"""
    tasks_dir = Path(__file__).parent / "tasks"
    task_files = sorted(tasks_dir.glob("*.md"))
    
    fixed = 0
    for task_file in task_files:
        if fix_task_file(task_file):
            fixed += 1
            print(f"Fixed {task_file.name}")
    
    print(f"\nFixed {fixed} task files")

if __name__ == '__main__':
    main()

