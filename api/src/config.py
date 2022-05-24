"""
"""

import json

from os.path import abspath, dirname, join, realpath


CONFIG_FILE_NAME = "config.json"

CONFIG_FILE_PATH = abspath(
    join(dirname(realpath(__file__)), "..", CONFIG_FILE_NAME))


def load_config():
    """
    """

    with open(CONFIG_FILE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)
