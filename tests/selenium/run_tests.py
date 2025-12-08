"""
Test Runner Script for FoodHub Selenium Tests
Run all tests and generate HTML report
"""
import subprocess
import sys
import os


def run_tests():
    """Execute all Selenium tests with pytest"""
    
    print("=" * 70)
    print("FoodHub Selenium Test Suite")
    print("=" * 70)
    print()
    
    # Ensure we're in the correct directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create screenshots directory if it doesn't exist
    os.makedirs("screenshots", exist_ok=True)
    os.makedirs("reports", exist_ok=True)
    
    # Run pytest with options
    pytest_args = [
        "pytest",
        "test_foodhub.py",
        "-v",                                    # Verbose output
        "--html=reports/test_report.html",       # HTML report
        "--self-contained-html",                 # Embedded CSS/JS in report
        "-s",                                    # Show print statements
        "--tb=short"                             # Short traceback format
    ]
    
    print(f"Running command: {' '.join(pytest_args)}")
    print()
    
    try:
        result = subprocess.run(pytest_args, check=False)
        
        print()
        print("=" * 70)
        if result.returncode == 0:
            print("✓ All tests passed successfully!")
        else:
            print(f"⚠ Some tests failed (exit code: {result.returncode})")
        print("=" * 70)
        print()
        print("Test report generated: reports/test_report.html")
        print()
        
        return result.returncode
        
    except FileNotFoundError:
        print("Error: pytest not found. Please install requirements:")
        print("  pip install -r requirements.txt")
        return 1
    except Exception as e:
        print(f"Error running tests: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(run_tests())
