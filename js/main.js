$(document).ready(function(){
	
	// Define Handlebars helpers
	var
		// Loop
		eachHelper = function(context, options) {
			var out = "";

			for(var i=0, j=context.length; i<j; i++) {
				out = out + options.fn(context[i]);
			}

			return out;
		},

		// Check if two value isn't equal
		ifNotEqualHelper = function(a, b, options) {
			if (a !== b) return options.fn(this);
		},

		// Calculate total cost of the dish
		dishTotalCostHelper = function(options) {
			return this.num * this.cost;
		},

		// Calculate total cost of the order
		orderTotalCostHelper = function(options) {
			var dishes = this.dishes || this;
			
			if (!dishes.length) {
				return dishes.num * dishes.cost;
			}

			var totalCost = 0;

			for (var i = 0; i < dishes.length; i++) {
				var dish = dishes[i];

				totalCost += dish.num * dish.cost;
			}

			return totalCost;
		};

	/*
	 * Create Handlebars template functions from selected templates, 
	 * which will generate DOM by giving data
	 */
	var 
		tmplOrder = Handlebars.compile($('#order-tmpl').html()),
		tmplOrderFull = Handlebars.compile($('#order-full-tmpl').html());

	// Register helpers
	Handlebars.registerHelper('each', eachHelper);
	Handlebars.registerHelper('if_n_eq', ifNotEqualHelper);
	Handlebars.registerHelper('dish_total_cost', dishTotalCostHelper);
	Handlebars.registerHelper('order_total_cost', orderTotalCostHelper);

	// Callbacks
	var 
		showError = function(req, errType, errMsg) {
			alert(errMsg);
		},

		showLoader = function() {
			$('.loader-wr').show();
		},

		hideLoader = function() {
			$('.loader-wr').hide()
		};

	// When DOM is loaded, load data from JSON
	$.ajax('data.json', {
		dataType: 'json',
		success: function(res) {
			// Create DOM by fetching data and template
			var html = tmplOrder(res);

			// Insert generated DOM into the page
			$('.orders').html(html);
		},
		error: showError,
		beforeSend: showLoader,
		complete: hideLoader
	});

	$('.orders').on('click', '.order-descr', function(){
		var orderID = $(this).data('id');

		$.ajax('data.json', {
			dataType: 'json',
			success: function(res) {
				var order = null;

				// Find order with id equals to data-id attribute of clicked order
				for (var i = 0; i < res.orders.length; i++) {
					if (res.orders[i].id === orderID) {
						order = res.orders[i];
						break;
					}
				}

				var html = tmplOrderFull(order);
				$('.order-descr-full').html(html);
			},
			error: showError,
			beforeSend: showLoader,
			complete: hideLoader
		});
	});

	// Prevent hiding filter when user scroll page
	$(window).on('scroll', function(){
		var 
			filters = $('.filters'),
			filtersOffsetTop = filters.offset().top,
			winOffsetTop = $(this).scrollTop();

		if (winOffsetTop > filterOffsetTop) {
			filters.addClass('filters-fixed');
		}
		// I suppose header can't be less than 50 px
		else if (winOffsetTop < 50) {
			filters.removeClass('filters-fixed');
		}
	})
});
