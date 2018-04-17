(function() {
    function invoiceProvider($http) {
		this.getInvoice = function (invoice_id,  token, amount, callback) {
			var op;
			var url = "https://jackc2invoiceapi.azurewebsites.net/api/values/" + invoice_id + "?op=" ;			
			if (amount && token)
			{
				op = 1;
				url += op + "&token=" + token + "&amount=" + amount;
				
			}else 
			{
				op = 0;
				url += op;
			}
			console.log(url);
			$http.get(url)
			.then (function (response) {
				if (response.status != 200)
				{
					callback("network error", null);
				}
				else if (response.data.Success != true)
				{
					console.log (response.data.Error);
					callback(response.data.Error, null);
				}
				else {
					callback(null, response.data.SalesInvoice);
				}
			});    
		}    
    }
    myApp.service("invoiceProvider", invoiceProvider);
})();

(function() {

    function initStripe(invoiceAmount, invoiceProvider, invoiceID, $scope) {
		var handler = StripeCheckout.configure({
			key: 'pk_test_BOMREN7R5zcx8Nv5PcS4Gm7n',
			image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
			locale: 'auto',
			token: function(token) {
				$scope.page_load_error='submitting...';
				invoiceProvider.getInvoice(invoiceID, token.id, invoiceAmount * 100, function(err, results) {
					if (err) {
						$scope.page_load_error=err;
					}else {
						window.location.reload();
					}
				});
			}
		});

		document.getElementById('customButton').addEventListener('click', function(e) {
			// Open Checkout with further options:
			handler.open({
			name: 'Stripe.com',
			description: '2 widgets',
			zipCode: true,
			amount: invoiceAmount * 100
			});
			e.preventDefault();
		});

		// Close Checkout on page navigation:
		window.addEventListener('popstate', function() {
			handler.close();
		});
    };
    
    function invoiceController ($scope, $location, $routeParams, invoiceProvider) {
		var invoiceID = $routeParams.invoice_id;
		if (invoiceID)
		{
			console.log(invoiceID);
			$scope.page_load_error='Loading data...';
			invoiceProvider.getInvoice(invoiceID, null,null,function(err, results) {
				if (err) {
					$scope.page_load_error=err;
				}else {
					$scope.page_load_error='';
					$scope.salesInvoice = results;
					var amount = results.salesLinesField[0].total_Amount_Incl_VATField;
					console.log("amount=" + amount);
					initStripe(amount, invoiceProvider, invoiceID);
				}
			});
		}
		else 
		{
			$scope.page_load_error="wrong parameter";
		}
    }
    myApp.controller("InvoiceController", invoiceController);
})();


