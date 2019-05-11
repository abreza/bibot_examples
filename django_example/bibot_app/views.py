import requests
from django.contrib import messages
from django.shortcuts import render


def check_bibot_response(request):
    if request.POST.get('bibot-response') is not None:
        if request.POST.get('bibot-response') != '':
            r = requests.post('https://api.bibot.ir/api1/siteverify/', data={
                'secret': 'your_site_key',
                'response': request.POST['bibot-response']
            })
            print(r.json())
            if r.json()['success']:
                messages.success(request, 'فرایند تایید هویت شما با موفقیت انجام شد!')
                return True
            elif r.json()['error-codes']:
                for error_code in r.json()['error-codes']:
                    messages.error(request, error_code)
                return False
            else:
                messages.error(request, 'بی‌بات به درستی حل نشده است!')
                return False
        else:
            messages.error(request, 'بی‌بات به درستی حل نشده است!')
            return False
    messages.error(request, 'ارتباط با سرور بی‌بات برقرار نشده است! آیا جاوااسکریپت شما فعال است؟')
    return False


def example(request):
    if request.method == 'POST':
        if check_bibot_response(request):
            print('success')
        else:
            print('failure')
    return render(request, 'example.html')

