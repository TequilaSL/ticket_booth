<div class="currency dropdown">
    @if(count($currencies) > 1)
        <a class="dropdown-toggle" href="#" role="button" id="dropdownCurrency" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span id="currentCurrency">{{ $currencies[$current_currency]['key'] }}</span>
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownCurrency">
            @foreach($currencies as $key => $curr)
                <a class="dropdown-item switch-currency {{ $key == $current_currency ? 'active' : '' }}"
                   href="javascript:void(0);" data-currency="{{ $curr['key'] }}">
                    {{ $curr['key'] }}
                </a>
            @endforeach
        </div>
    @endif
</div>
