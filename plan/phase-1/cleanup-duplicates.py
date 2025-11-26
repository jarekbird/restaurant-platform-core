#!/usr/bin/env python3
"""
Clean up duplicate test cases sections in task files
"""

import re
from pathlib import Path

def cleanup_task_file(task_file_path: Path):
    """Remove duplicate test cases sections"""
    with open(task_file_path, 'r') as f:
        content = f.read()
    
    # Find all test cases sections
    test_section_pattern = r'(## Test Cases / User Stories.*?)(?=## Definition of Done|## Related Tasks|$)'
    test_sections = re.findall(test_section_pattern, content, re.DOTALL)
    
    if len(test_sections) > 1:
        # Keep only the first one
        first_section = test_sections[0]
        
        # Remove all test sections
        content = re.sub(test_section_pattern, '', content, flags=re.DOTALL)
        
        # Insert the first one before Definition of Done
        content = re.sub(
            r'(## Related Tasks.*?\n\n)(## Definition of Done)',
            r'\1' + first_section + r'\n\n\2',
            content,
            flags=re.DOTALL
        )
        
        # Also fix Definition of Done formatting
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
            content = re.sub(
                r'(\*\*Definition of Done\*\*:\s*")([^"]+)(")',
                r'\1\2\3' + test_verification,
                content
            )
        
        with open(task_file_path, 'w') as f:
            f.write(content)
        
        return True
    
    return False

def main():
    """Main function"""
    tasks_dir = Path(__file__).parent / "tasks"
    task_files = sorted(tasks_dir.glob("*.md"))
    
    cleaned = 0
    for task_file in task_files:
        if cleanup_task_file(task_file):
            cleaned += 1
            print(f"Cleaned {task_file.name}")
    
    print(f"\nCleaned {cleaned} task files")

if __name__ == '__main__':
    main()

