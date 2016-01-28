function flickr_init(e) {
	var data_page = (typeof e == 'undefined') ? 1 : e.getAttribute('data-page')
	var xhttp = new XMLHttpRequest()
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 1) {
			document.querySelector(".flickr-gallery-container").classList.add('hidden')
			document.querySelector(".loading").classList.remove('hidden')
			document.querySelector(".flickr-nav").classList.add('hidden')
		} else if (xhttp.readyState == 4 && xhttp.status == 200) {
	    	var result = JSON.parse(xhttp.responseText)
	    	var fl = '', src_suffix = ''
	    	var gal_el = document.querySelector(".flickr-gallery-container")

			for (var i = 0; i < result.photos.photo.length; i++) {
				if (typeof document.querySelectorAll(".flickr-gallery-photo a")[i] == 'undefined')
					gal_el.appendChild(gal_el.querySelector(".flickr-gallery-photo").cloneNode(true))
			}

			var fl_set = document.querySelectorAll(".flickr-gallery-photo a")
			for (var i = 0; i < result.photos.photo.length; i++) {
				fl = result.photos.photo[i]
				var src_prefix = 'https://farm' + fl.farm + '.staticflickr.com/'
				if (typeof fl != 'undefined') {
					fl_set[i].setAttribute('data-title', fl.title)
					fl_set[i].setAttribute('data-abstract', fl.description._content)
					fl_set[i].setAttribute('href', src_prefix + fl.server + '/' + fl.id + '_' + fl.secret + '.jpg')
					fl_set[i].querySelector('img').setAttribute('src', src_prefix + fl.server + '/' + fl.id + '_' + fl.secret + '_n.jpg')
				}
			}
			gal_el.classList.remove('hidden')
			document.querySelector(".flickr-gallery span").classList.add('hidden')
			document.querySelector(".loading").classList.add('hidden')

			bind_events()
			render_nav(result.photos.page, result.photos.pages)
		}
	}
	xhttp.open("GET", 'http://localhost:8888/?page='+ data_page +'&search=' + document.getElementById('flick-search-term').value)
	xhttp.send()
}

function bind_events() {
	var fl_set = document.querySelectorAll(".flickr-gallery-photo a")
	for (var i = 0; i < fl_set.length; i++) {
		fl_set[i].addEventListener("click", function(e){
			e.preventDefault()
			document.querySelector(".flickr-upscale").classList.remove("flickr-upscale-close")
			document.getElementById('flickr_spotlight').setAttribute('src', this.getAttribute('href'))

			var fl_meta = document.querySelector(".flickr-upscale-info")
				fl_meta.querySelector("h2").innerHTML = this.getAttribute('data-title')
				fl_meta.querySelector("p").innerHTML = this.getAttribute('data-abstract')
		})
	}
}

function render_nav(page, total_pages) {
	var nav_container = document.querySelector(".flickr-nav")
	var page_el = document.querySelectorAll(".flickr-nav a")
	var page_btn_count = 10, page_middle = Math.ceil(page_btn_count/2)
	var index = (page < (page_middle)) ? 1 : ((page >= total_pages) ? page - (page_btn_count - 1) : page - (page_middle - 1))

	for (var i = 0; i < page_btn_count; i++) {
		if (typeof page_el[i] == 'undefined')
			nav_container.appendChild(page_el[0].cloneNode(true))
		var nav_el = document.querySelectorAll(".flickr-nav a")
			nav_el[i].classList.remove('flickr-nav-current')
			nav_el[i].setAttribute('data-page', (page > 1) ? index : i + 1) 
			nav_el[i].innerHTML = (i >= total_pages || (page > 1 && index > total_pages)) ? "" : (page > 1) ? index : i + 1

		if (index == page) document.querySelectorAll(".flickr-nav a")[i].classList.add('flickr-nav-current')
		index++
	}
	nav_container.classList.remove('hidden')
}

document.querySelector(".flickr-upscale span").addEventListener("click", function(e) {
	document.querySelector(".flickr-upscale").classList.add("flickr-upscale-close")
})

document.getElementById("flick-search-term").addEventListener("keydown", function(e) {
    if (window.event.keyCode == 13) 
    	flickr_init()
}, false)