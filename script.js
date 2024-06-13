console.log("calculateur v0.5");
var price = 200;
var selectionPrice = 26.875;
var unitPrice = 26.875

window.addEventListener('message', (event) => {
            console.log(event.origin)
            if (event.origin !== 'https://kurioscape.4escape.io') {
                return;
            }

            // Traiter les données reçues
            const data = event.data;
            price = data.value;
            document.querySelector("#price").textContent = `(prix de la réservation (4escape) : ${price} €)`;
            updateBar();
        }, false);

document.addEventListener('DOMContentLoaded', () => {
    const counter = document.getElementById('counter');
    const incrementButton = document.getElementById('increment');
    const decrementButton = document.getElementById('decrement');
    const barContainer = document.getElementById('bar-container');
    const clickedTooltip = document.getElementById('clicked-tooltip');
    const endTooltip = document.getElementById('end-tooltip');

    window.addEventListener('message', (event) => {
            console.log("inner code updateBar triggered");
            if (event.origin !== 'https://kurioscape.4escape.io') {
                return;
            }
        updateBar();
    }

    function updateBar() {
        const value = parseInt(counter.value);
        barContainer.innerHTML = '';
        for (let i = 0; i < value; i++) {
            const segment = document.createElement('div');
            segment.className = 'bar-segment';
            segment.textContent = i+1;
            if (i === 0) {
                segment.classList.add('selected');
            }
            segment.addEventListener('click', () => {
                highlightClickedSegment(i);
                selectSegmentsUpTo(i);
            });
            barContainer.appendChild(segment);
        }
        highlightClickedSegment(0);
        showTooltip(endTooltip, barContainer.lastElementChild);
        updateSelectedCount();
    }

    function selectSegmentsUpTo(index) {
    const segments = document.querySelectorAll('.bar-segment');
    segments.forEach((segment, i) => {
        if (i <= index) {
            segment.classList.add('selected');
        } else {
            segment.classList.remove('selected');
        }
      });
      updateSelectedCount();
    }

    function highlightClickedSegment(index) {
        const segments = document.querySelectorAll('.bar-segment');
        segments.forEach((segment, i) => {
            if (i === index) {
                segment.classList.add('clicked');
                showTooltip(clickedTooltip, segment);
            } else {
                segment.classList.remove('clicked');
            }
          });
    }

    function showTooltip(tooltip, segment) {
      const rect = segment.getBoundingClientRect();
      tooltip.style.left = `${rect.right + window.scrollX-2}px`;
      tooltip.style.top = `${rect.bottom + window.scrollY}px`;
      tooltip.style.transform = 'translateX(-100%)';
      tooltip.style.display = 'block';
    }

    Number.prototype.toFixedDown = function(digits) {
      var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
          m = this.toString().match(re);
      return m ? parseFloat(m[1]) : this.valueOf().toFixed(1);
    };

    function updateSelectedCount() {
        const selectedSegments = document.querySelectorAll('.bar-segment.selected').length;
        unitPrice = price/counter.value;
        unitPrice = unitPrice.toFixedDown(1);
        selectionPrice = unitPrice*selectedSegments;
        selectionPrice = selectionPrice.toFixedDown(1);
        const newTotal = (unitPrice*counter.value).toFixedDown(1);

        document.querySelector("#clicked-tooltip").textContent = `${selectionPrice}0€`;
        document.querySelector("#end-tooltip").textContent = `${newTotal}0€`;
    }

    incrementButton.addEventListener('click', () => {
        counter.value = parseInt(counter.value) + 1;
        updateBar();
    });

    decrementButton.addEventListener('click', () => {
        if (parseInt(counter.value) > 1) {
            counter.value = parseInt(counter.value) - 1;
            updateBar();
        }
    });

    //showTooltip(clickedTooltip,1);
    updateBar(); // Initial call to set the bar based on the default value
});
