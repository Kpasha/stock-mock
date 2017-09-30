using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace stock_mock_API.Models
{
    public class QuotesBody
    {
        public List<string> symbols { get; set; }
    }
}