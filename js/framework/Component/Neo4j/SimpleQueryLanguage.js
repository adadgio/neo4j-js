/**
 * SimpleQueryLanguage
 */
define(function () {
    return {

        /**
         * :Page name=test
         */
        translate: function (string) {
            // find if there is/are label(s)
            var labels = "";
            var properties  = [];
            var regexp1 = new RegExp(/(:[a-zA-Z:]+)\s{0,}/);
            var regexp2 = new RegExp(/\s([a-z\]+)=([a-z0-9A-Z\s]+)\s?/);

            var matches1 = string.match(regexp1);
            if (matches1) {
                labels = matches1[1];
            }

            var matches2 = string.match(regexp2);
            if (matches2) {
                var props = matches2[1].split(" ");

                for (var i=0; i < props.length; i++) {
                    var expl  = props[i].split("=");
                    var exprs = expl[0] + ":'" + expl[1] + "'";
                    properties.push(exprs);
                }

            }

            var queryString = "MATCH (n"+ labels;

            if (properties.length > 0) {
                queryString += " {" + properties.join(', ') + "}";
            }

            // close query string
            queryString += ") RETURN n, ID(n) AS _id, labels(n) AS _labels LIMIT 60";

            return queryString;
        }

    };
});
