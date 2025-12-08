"""
Utility functions and helper methods for Selenium tests
"""
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
import time


class TestHelpers:
    """Helper class with utility methods for testing"""
    
    @staticmethod
    def wait_for_element(driver, by, value, timeout=10):
        """Wait for element to be present"""
        try:
            element = WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return element
        except TimeoutException:
            print(f"Element not found: {by}={value}")
            return None
    
    @staticmethod
    def wait_for_clickable(driver, by, value, timeout=10):
        """Wait for element to be clickable"""
        try:
            element = WebDriverWait(driver, timeout).until(
                EC.element_to_be_clickable((by, value))
            )
            return element
        except TimeoutException:
            print(f"Element not clickable: {by}={value}")
            return None
    
    @staticmethod
    def wait_for_url_contains(driver, url_fragment, timeout=10):
        """Wait for URL to contain specific text"""
        try:
            WebDriverWait(driver, timeout).until(
                EC.url_contains(url_fragment)
            )
            return True
        except TimeoutException:
            return False
    
    @staticmethod
    def safe_click(driver, element):
        """Safely click an element with scroll into view"""
        try:
            driver.execute_script("arguments[0].scrollIntoView(true);", element)
            time.sleep(0.5)
            element.click()
        except Exception as e:
            print(f"Click failed: {e}")
            driver.execute_script("arguments[0].click();", element)
    
    @staticmethod
    def take_screenshot(driver, filename):
        """Take screenshot for debugging"""
        try:
            driver.save_screenshot(f"screenshots/{filename}.png")
            print(f"Screenshot saved: {filename}.png")
        except Exception as e:
            print(f"Screenshot failed: {e}")
    
    @staticmethod
    def get_element_text(driver, by, value, timeout=5):
        """Get text from element safely"""
        try:
            element = WebDriverWait(driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return element.text
        except TimeoutException:
            return ""


class TestData:
    """Test data for FoodHub application"""
    
    # Customer credentials
    CUSTOMER_USER = {
        "username": "test_customer",
        "email": "customer@test.com",
        "password": "Test123!",
        "role": "customer"
    }
    
    # Restaurant credentials
    RESTAURANT_USER = {
        "username": "test_restaurant",
        "email": "restaurant@test.com",
        "password": "Test123!",
        "role": "restaurant"
    }
    
    # Admin credentials
    ADMIN_USER = {
        "username": "admin",
        "email": "admin@test.com",
        "password": "Admin123!",
        "role": "admin"
    }
    
    # Sample restaurant data
    SAMPLE_RESTAURANT = {
        "name": "Test Restaurant",
        "cuisine": "Italian",
        "description": "Best pasta in town"
    }
    
    # Sample menu item
    SAMPLE_MENU_ITEM = {
        "name": "Margherita Pizza",
        "price": "12.99",
        "description": "Classic pizza with fresh mozzarella"
    }
