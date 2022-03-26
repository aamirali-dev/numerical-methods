from . import views
from django.urls import path
urlpatterns = [
	path("", views.index, name='index'),
	path('<str:selected_method>/', views.index, name='selected_method'),
]