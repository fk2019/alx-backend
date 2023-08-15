#!/usr/bin/python3
"""BasicCache module
"""
BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """BasicCache defines put and get methods"""
    def __init__(self):
        """Initialize"""
        super().__init__()

    def put(self, key, item):
        """Add item in cache"""
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """Retrieve item by key"""
        if key:
            return self.cache_data.get(key)
        return None
