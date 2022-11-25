from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from chips import views

urlpatterns = [
    path('chips/', views.ChipList.as_view()),
    path('chips/<int:pk>/', views.ChipDetail.as_view()),
    path('goals/', views.GoalList.as_view()),
    path('goals/<int:pk>/', views.GoalDetail.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)
