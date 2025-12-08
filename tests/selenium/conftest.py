"""
Pytest configuration file for Selenium tests
Provides shared fixtures and setup for all test cases
"""
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time


@pytest.fixture(scope="function")
def driver():
    """
    Setup Chrome WebDriver with headless mode for CI/CD compatibility
    Works with Chrome, Chromium, and Brave browsers
    """
    chrome_options = Options()
    
    # Headless mode - required for Jenkins/AWS EC2
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    
    # Additional options for stability
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    
    # For Brave browser - uncomment and adjust path if needed
    brave_path = "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe"
    import os
    if os.path.exists(brave_path):
        chrome_options.binary_location = brave_path
        print(f"Using Brave browser from: {brave_path}")
    
    # Initialize WebDriver
    try:
        # Try automatic ChromeDriver management
        service = Service(ChromeDriverManager().install())
        driver = webdriver.Chrome(service=service, options=chrome_options)
    except Exception as e:
        print(f"ChromeDriver Manager failed: {e}")
        print("Attempting to use system ChromeDriver...")
        # Fallback to system ChromeDriver
        driver = webdriver.Chrome(options=chrome_options)
    
    # Set implicit wait
    driver.implicitly_wait(10)
    
    yield driver
    
    # Cleanup
    driver.quit()


@pytest.fixture(scope="session")
def base_url():
    """Base URL for the FoodHub application"""
    return "http://localhost:3000"


@pytest.fixture(scope="session")
def api_url():
    """Base URL for the FoodHub API"""
    return "http://localhost:8080"


def pytest_html_report_title(report):
    """Customize HTML report title"""
    report.title = "FoodHub Selenium Test Report"
