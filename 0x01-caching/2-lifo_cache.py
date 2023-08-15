#!/usr/bin/python3
"""LIFOCache module
"""
from collections import OrderedDict

BaseCaching = __import__('base_caching').BaseCaching


class LIFOCache(BaseCaching):
    """LIFOCache caches using LIFO"""
    def __init__(self):
        """Initialize"""
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """Add item in cache and delete last item if len of cache exceeds
        max_items"""
        if key and item:
            if key not in self.cache_data:
                if len(self.cache_data.keys()) + 1 > BaseCaching.MAX_ITEMS:
                    last_k, _ = self.cache_data.popitem(True)
                    print('DISCARD: {}'.format(last_k))
            self.cache_data[key] = item
            self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """Retrieve item by key"""
        if key:
            return self.cache_data.get(key)
        return None
