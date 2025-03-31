const viz = {
  render: (data, element) => {
    element.innerHTML = `<canvas id="scatterChart" width="600" height="400"></canvas>`;
    const ctx = document.getElementById("scatterChart").getContext("2d");

    const xIndex = data.fields.findIndex(f => f.name === "X Axis");
    const yIndex = data.fields.findIndex(f => f.name === "Y Axis");
    const imageIndex = data.fields.findIndex(f => f.name === "Image URL");

    const chartData = data.tables.DEFAULT.map(row => ({
      x: parseFloat(row[xIndex].value),
      y: parseFloat(row[yIndex].value),
      image: row[imageIndex].value
    }));

    // Create custom image points
    const pointImages = chartData.map(point => {
      const img = new Image();
      img.src = point.image;
      return img;
    });

    new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [{
          label: "Custom Image Points",
          data: chartData,
          pointStyle: pointImages,
          pointRadius: 20
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            title: { display: true, text: "X Axis" }
          },
          y: {
            title: { display: true, text: "Y Axis" }
          }
        }
      }
    });
  }
};

looker.plugins.visualizations.add(viz);