const viz = {
  render: (data, element) => {
    element.innerHTML = `<canvas id="scatterChart" width="600" height="400"></canvas>`;
    const ctx = document.getElementById("scatterChart").getContext("2d");

    // Get indexes for fields
    const xIndex = data.fields.findIndex(f => f.name === "X Axis");
    const yIndex = data.fields.findIndex(f => f.name === "Y Axis");
    const imageIndex = data.fields.findIndex(f => f.name === "Image URL");

    if (xIndex === -1 || yIndex === -1 || imageIndex === -1) {
      element.innerHTML = `<p style="color: red;">Missing required fields: "X Axis", "Y Axis", and/or "Image URL".</p>`;
      return;
    }

    // Build data array
    const chartData = data.tables.DEFAULT.map(row => ({
      x: parseFloat(row[xIndex].value),
      y: parseFloat(row[yIndex].value),
      image: row[imageIndex].value
    }));

    // Load images into Image objects
    const pointImages = chartData.map(point => {
      const img = new Image();
      img.src = point.image;
      return img;
    });

    // Create Chart
    new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Image Points',
          data: chartData,
          pointRadius: 0, // Hide default points
        }]
      },
      options: {
        responsive: true,
        animation: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context => {
                const point = chartData[context.dataIndex];
                return `(${point.x}, ${point.y})`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: 'X Axis' }
          },
          y: {
            title: { display: true, text: 'Y Axis' }
          }
        }
      },
      plugins: [{
        id: 'imagePointsPlugin',
        afterDatasetsDraw(chart) {
          const { ctx, data } = chart;
          const meta = chart.getDatasetMeta(0);

          chartData.forEach((point, i) => {
            const pos = meta.data[i].getProps(['x', 'y'], true);
            const img = pointImages[i];
            const size = 24; // Image size (px)

            if (img.complete) {
              ctx.drawImage(img, pos.x - size / 2, pos.y - size / 2, size, size);
            } else {
              img.onload = () => {
                ctx.drawImage(img, pos.x - size / 2, pos.y - size / 2, size, size);
              };
            }
          });
        }
      }]
    });
  }
};

looker.plugins.visualizations.add(viz);