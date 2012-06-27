dc.createPieChart = function(selector) {
    return new this.PieChart(selector);
};

dc.PieChart = function(selector) {
    var selector = selector;
    var root = d3.select(selector);

    var colors = d3.scale.category20c();

    var dimension;
    var group;

    var width;
    var height;
    var radius;


    this.render = function() {
        root.select("svg").remove();

        var topG = generateTopLevelG();

        var dataPie = d3.layout.pie().value(function(d) {
            return d.value;
        });

        var circle = d3.svg.arc().outerRadius(radius);

        var slices = drawSlices(topG, dataPie, circle);

        drawLabels(slices, circle);
    }

    this.select = function(s) {
        return root.select(s);
    }

    this.selectAll = function(s) {
        return root.selectAll(s);
    }

    this.colors = function(c) {
        if (!arguments.length) return colors;
        colors = c;
        return this;
    }

    this.dimension = function(d) {
        if (!arguments.length) return dimension;
        dimension = d;
        return this;
    }

    this.group = function(g) {
        if (!arguments.length) return group;
        group = g;
        return this;
    }

    this.filter = function(f) {
        dimension.filter(f);
        return this;
    }

    this.width = function(w) {
        if (!arguments.length) return width;
        width = w;
        return this;
    }

    this.height = function(h) {
        if (!arguments.length) return height;
        height = h;
        return this;
    }

    this.radius = function(r) {
        if (!arguments.length) return radius;
        radius = r;
        return this;
    }

    function generateTopLevelG() {
        var topG = root.append("svg")
            .data([group.all()])
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + cx() + "," + cy() + ")");
        return topG;
    }

    function cx() {
        return width / 2;
    }

    function cy() {
        return height / 2;
    }

    function drawSlices(topG, dataPie, circle) {
        var slices = topG.selectAll("g.pie-slice")
            .data(dataPie)
            .enter()
            .append("g")
            .attr("class", "pie-slice");

        slices.append("path")
            .attr("fill", function(d, i) {
                return colors(i);
            })
            .attr("d", circle);
        return slices;
    }

    function drawLabels(slices, circle) {
        slices.append("text")
            .attr("transform", function(d) {
                d.innerRadius = 0;
                d.outerRadius = radius;
                var centroid = circle.centroid(d);
                if (isNaN(centroid[0]) || isNaN(centroid[1])) {
                    return "translate(0,0)";
                } else {
                    return "translate(" + centroid + ")";
                }
            })
            .attr("text-anchor", "middle")
            .text(function(d) {
                var data = d.data;

                if(data.value == 0)
                    return "";

                return data.key;
            });
    }

};

