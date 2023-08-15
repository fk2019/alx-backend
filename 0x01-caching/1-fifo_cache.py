#!/usr/bin/python3
"""FIFOCache module
"""
BaseCaching = __import__('base_caching').BaseCaching


class FIFOCache(BaseCaching):
    """FIFOCache caches using FIFO"""
    def __init__(self):
        """Initialize"""
        super().__init__()

    def put(self, key, item):
        """Add item in cache and delete first item if len of cache exceeds
        max_items"""
        if key and item:
            self.cache_data[key] = item
            if len(self.cache_data.keys()) > BaseCaching.MAX_ITEMS:
                first = list(self.cache_data.keys())[0]
                print('DISCARD: {}'.format(first))
                del self.cache_data[first]

    def get(self, key):
        """Retrieve item by key"""
        if key:
            return self.cache_data.get(key)
        return None
