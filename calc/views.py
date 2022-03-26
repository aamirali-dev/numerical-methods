from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def index(request, selected_method=None):
    method_to_function = {
        'favicon.ico': HttpResponse(),
    }
    if selected_method is None:
        return render(request, 'index.html')
    if selected_method in method_to_function.keys():
        return method_to_function[selected_method]
    return render(request, selected_method+'.html')

    
