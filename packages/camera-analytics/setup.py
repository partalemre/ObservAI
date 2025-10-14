from setuptools import setup, find_packages

setup(
    name="camera-analytics",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "opencv-python>=4.8.0",
        "ultralytics>=8.1.0",
        "numpy>=1.23",
        "pyyaml>=6.0",
        "aiohttp>=3.9.0",
        "python-socketio>=5.10.0",
    ],
    extras_require={
        "demographics": [
            "insightface>=0.7.3",
            "onnxruntime>=1.16.0",
        ],
    },
    python_requires=">=3.9,<3.14",
)
