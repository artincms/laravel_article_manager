<!doctype html>
<html lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('page_title','KaraSun - backend')</title>

    <!-- Bootstrap CSS -->
    @include('LAM::layouts.helpers.css.core_css')

    <!-- Optional CSS -->
    @yield('plugin_css')
    @yield('inline_css')
</head>
<body>
@yield('content')

<!-- jQuery first, then Popper.js, then Bootstrap JS -->
@include('LAM::layouts.helpers.js.core_js')

<!-- Optional JavaScript -->
@yield('plugin_js')
@yield('inline_js')

</body>
</html>
