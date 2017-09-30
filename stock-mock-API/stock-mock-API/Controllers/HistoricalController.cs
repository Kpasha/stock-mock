using RestSharp;
using stock_mock_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace stock_mock_API.Controllers
{
    public class HistoricalController : ApiController
    {
        [HttpPost]
        [Route("api/historical")]
        public object GetHistorical(HistoricalBody body)
        {
            var client = new RestClient("https://www.alphavantage.co/");

            var request = new RestRequest("query?function={function}&symbol={symbol}&apikey={apikey}", Method.GET);
            request.AddUrlSegment("function", "TIME_SERIES_DAILY");
            request.AddUrlSegment("symbol", body.Symbol);
            request.AddUrlSegment("apikey", "B6Q7PMMAWLCJXQCC");

            IRestResponse response = client.Execute(request);
            var content = response.Content;

            return new
            {
                content = content
            };
        }
    }
}
