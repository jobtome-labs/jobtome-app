"""
"""

import json

from os.path import abspath, dirname, join, realpath


SEED_FILE_NAME = "seed.json"

SEED_FILE_PATH = abspath(
    join(dirname(realpath(__file__)), "..", SEED_FILE_NAME))


def _load_seed_file():
    """
    """

    with open(SEED_FILE_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def seed_database(target, connection, **kw):
    """
    """

    print(" [***] Seeding Database ...")

    seed_data = _load_seed_file()

    connection.execute(
        target.insert(),
        seed_data["jobs"])

    print(" [***] Seeding Database Done.")
