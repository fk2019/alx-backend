#!/usr/bin/env python3
"""Simple helper function that takes page and page_size
   and return a tuple of size two containing start index
   and an end index
   Server class to paginate a db of popular baby names
   get_page return appropriate page of dataset
   get_hyper returns dictionary
"""
from typing import Tuple, List
import csv
import math


def index_range(page: int, page_size: int) -> Tuple:
    """Return start and end index as tuple"""
    start_index = 0
    end_index = 0
    for _ in range(page):
        start_index = end_index
        end_index += page_size
    return (start_index, end_index)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Return list of correct page of db dataset"""
        assert type(page) is int and page > 0
        assert type(page_size) is int and page_size > 0
        dataset = self.dataset()
        try:
            index = index_range(page, page_size)
            start_index = index[0]
            end_index = index[1]
            return dataset[start_index: end_index]
        except IndexError:
            return []

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """Return dictionary of key-value pairs"""
        page_list = self.get_page(page, page_size)
        p_size = page_size if page_size <= len(page_list) else len(page_list)
        total_pages = len(self.dataset()) // page_size + 1
        pair = {
            'page_size': p_size,
            'page': page,
            'data': page_list,
            'next_page': page + 1 if page + 1 <= total_pages else None,
            'prev_page': page - 1 if page > 1 else None,
            'total_pages': total_pages
            }
        return pair
