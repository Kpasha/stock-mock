using stock_mock_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using YSQ.core.Quotes;

namespace stock_mock_API.Controllers
{
    public class QuotesController : ApiController
    {
        [HttpPost]
        [Route("api/quotes")]
        public List<Quote> GetQuotes(QuotesBody body)
        {
            //Create the quote service
            var quote_service = new QuoteService();

            string[] symbols = body.symbols.ToArray();

            //Get a quote
            var quotes = quote_service.Quote(symbols).Return(QuoteReturnParameter.Symbol,
                                                             QuoteReturnParameter.Name,
                                                             QuoteReturnParameter.LatestTradePrice,
                                                             QuoteReturnParameter.LatestTradeTime);

            List<Quote> quotes_list = new List<Quote>();

            //Get info from the quotes
            foreach (var quote in quotes)
            {
                Quote q = new Quote
                {
                    Symbol = quote.Symbol,
                    Name = quote.Name,
                    LatestTradePrice = quote.LatestTradePrice,
                    LatestTradeTime = quote.LatestTradeTime
                };

                quotes_list.Add(q);
            }

            return quotes_list;
        }
    }
}
