'use strict';

const INIT_SHOW = 15;

(() => {
    $(document).ready(function() {
        const $filters = $('#filters'),
            $sorts = $('#sorts');

        let $grid = $('.grid').isotope({
            itemSelector: '.element-item',
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-sizer'
            },
            getSortData: {
                category: '[data-category]'
            },
            containerStyle: {
                position: 'relative',
                overflow: 'hidden'
            }
        });

        $(function() {
            $('#datepicker').datepicker({
                dateFormat: 'yy-mm-dd',
                constrainInput: false
            });
        });

        // bind filter button click
        $filters.on('click', 'button', function() {
            let filterValue = $(this).attr('data-filter');
            filterValue = filterFns[filterValue] || filterValue;
            $grid.isotope({ filter: filterValue });
        });

        // bind sort button click
        $sorts.on('click', 'button', function() {
            let sortByValue = $(this).attr('data-sort-by');
            $grid.isotope({ sortBy: sortByValue });
        });

        // change is-checked class on buttons
        $('.button-group').each(function(i, buttonGroup) {
            let $buttonGroup = $(buttonGroup);
            $buttonGroup.on('click', 'button', function() {
                $buttonGroup.find('.is-checked').removeClass('is-checked');
                $(this).addClass('is-checked');
            });
        });


        let counter = INIT_SHOW;
        let iso = $grid.data('isotope');

        loadMore(INIT_SHOW); //execute function onload

        function loadMore(toShow) {
            $grid.find('.hidden').removeClass('hidden');

            let hiddenElems = iso.filteredItems
                .slice(toShow, iso.filteredItems.length)
                .map(function(item) {
                    return item.element;
                });

            $(hiddenElems).addClass('hidden');
            $grid.isotope('layout');

            if (hiddenElems.length === 0) {
                $('#load-more').hide();
            } else {
                $('#load-more').show();
            }
        }

        //append load more button
        $grid.after('<button id="load-more" class="btn btn-green"><i class="fa fa-refresh"></i> Load More</button>');

        //when load more button clicked
        $('#load-more').click(function() {
            if ($filters.data('clicked')) {
                counter = INIT_SHOW;
                $filters.data('clicked', false);
            } else {
                counter = counter;
            }

            counter = counter + INIT_SHOW;

            loadMore(counter);
        });

        //when filter button clicked
        $filters.click(function() {
            $(this).data('clicked', true);

            loadMore(INIT_SHOW);
        });

        // filter functions
        let filterFns = {
            numberGreaterThan50: function() {
                let number = $(this).find('.number').text();
                return parseInt(number, 10) > 50;
            },
            ium: function() {
                let name = $(this).find('.name').text();
                return name.match(/ium$/);
            }
        };
    });
})();