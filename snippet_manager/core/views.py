from datetime import date
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from core.serializers import SnippetSerializer

from core.forms import addSnippet
from core.models import Snippet, Language

def index(request):

    if request.method == "GET":
        search_text = request.GET.get('search_text', '')
        if search_text is not None and search_text != u"":
            search_text = request.GET.get('search_text', '')
            snippets = Snippet.objects.filter(title__contains = search_text)
        else:
            snippets = []

        return render(request, 'index.html', {'snippets':snippets})


@login_required
def add_snippet(request):
    if request.method == 'POST':
        form = addSnippet(request.POST)
        if form.is_valid():
            snippet = Snippet.objects.create(title=form.cleaned_data['title'], description=form.cleaned_data['description'], language=form.cleaned_data['language'], code=form.cleaned_data['code'], user=request.user)
            snippet.save()
            return HttpResponseRedirect(reverse('index'))
    else:
        form = addSnippet()

    context = {
        'form': form,
        'code': form['code'],
    }

    return render(request, 'add_snippet.html', context=context)


@login_required
def user_home(request, username):
    user = get_object_or_404(User, username=username)
    
    if (user == request.user):
        snippets = Snippet.objects.filter(user=user)

        context = {
            'user': user,
            'snippets': snippets,
        }

        return render(request, 'user_home.html', context)

    else:
        return HttpResponseRedirect(reverse('index.html'))

@csrf_exempt
def snippet_list(request):
    """
    List snippets
    """
    if request.method == 'GET':
        snippets = Snippet.objects.all()
        serializer = SnippetSerializer(snippets, many=True)
        return JsonResponse(serializer.data, safe=False)