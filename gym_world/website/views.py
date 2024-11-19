from django.shortcuts import render
from .models import Plan, Product, Service

def home(request):
    plans = Plan.objects.all()
    products = Product.objects.all()
    services = Service.objects.all()
    return render(request, 'website/index.html', {
        'plans': plans,
        'products': products,
        'services': services,
    })

def admin_panel(request):
    return render(request, 'website/admin.html')