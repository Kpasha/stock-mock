using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace stock_mock_API.Models
{
    public class Quote
    {
        public string Symbol { get; set; }
        public string Name { get; set; }
        public string LatestTradePrice { get; set; }
        public string LatestTradeTime { get; set; }
    }
}