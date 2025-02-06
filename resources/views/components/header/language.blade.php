<div class="language dropdown">
    <a class="dropdown-toggle" href="#" role="button" id="dropdownLanguage" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span>
            {{ LaravelLocalization::getSupportedLocales()[$current_locale]['name'] }}
        </span>
    </a>
    <div class="dropdown-menu" aria-labelledby="dropdownLanguage">
    @foreach(LaravelLocalization::getSupportedLocales() as $localeCode => $properties)
            <a class="dropdown-item" rel="alternate" hreflang="{{ $localeCode }}" @if(Request::getMethod() == 'POST') data-resubmit="listingForm" @endif href="{{ LaravelLocalization::getLocalizedURL($localeCode, null, [], true) }}">
                {{$properties['name']}}
            </a>
    @endforeach
    </div>
</div>
