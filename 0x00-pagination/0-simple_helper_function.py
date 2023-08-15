#!/usr/bin/env python3
"""Simple helper function that takes page and page_size
   and return a tuple of size two containing start index
   and an end index
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple:
    """Return start and end index as tuple"""
    start_index = 0
    end_index = 0
    for _ in range(page):
        start_index = end_index
        end_index += page_size
    return (start_index, end_index)
