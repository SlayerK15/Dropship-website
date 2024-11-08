# sample_data.py
from django.core.management.base import BaseCommand
from products.models import Category, Product
from django.core.files.uploadedfile import SimpleUploadedFile

class Command(BaseCommand):
    help = 'Populate the database with sample data'

    def handle(self, *args, **kwargs):
        # Create categories
        electronics = Category.objects.create(
            name='Electronics',
            description='Electronic devices and gadgets'
        )
        
        clothing = Category.objects.create(
            name='Clothing',
            description='Fashion and apparel'
        )

        # Create products
        products_data = [
            {
                'category': electronics,
                'name': 'Smartphone',
                'description': 'Latest model smartphone with advanced features',
                'price': 699.99,
                'stock': 50,
            },
            {
                'category': electronics,
                'name': 'Laptop',
                'description': 'High-performance laptop for professional use',
                'price': 1299.99,
                'stock': 30,
            },
            {
                'category': clothing,
                'name': 'T-Shirt',
                'description': 'Comfortable cotton t-shirt',
                'price': 19.99,
                'stock': 100,
            },
            {
                'category': clothing,
                'name': 'Jeans',
                'description': 'Classic blue jeans',
                'price': 49.99,
                'stock': 75,
            },
        ]

        for data in products_data:
            Product.objects.create(**data)

        self.stdout.write(self.style.SUCCESS('Successfully added sample data'))