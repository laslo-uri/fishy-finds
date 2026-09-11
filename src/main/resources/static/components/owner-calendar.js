Vue.component('owner-calendar', {
	data: function(){
		return{
			reservations: [],
			unavailabilities: [],
			offers: [],
			viewMode: 'month',
			cursor: new Date(),
			loading: true,
			error: '',
			form: {
				offerId: '',
				startDate: '',
				endDate: ''
			}
		}
	},
	template: `
		<div class="ff-catalog">
			<nav-bar></nav-bar>
			<section class="ff-catalog__shell">
				<div class="ff-section-head">
					<h2>Occupancy calendar</h2>
					<p>Week strip, month grid, or yearly overview of your bookings and unavailable periods.</p>
				</div>
				<div class="ff-detail" style="margin-bottom:1.25rem;">
					<h3 class="ff-detail__title">Mark unavailable</h3>
					<div class="ff-form-grid">
						<label class="ff-control ff-field--wide">
							<span>Offer</span>
							<select class="ff-field" v-model="form.offerId">
								<option disabled value="">Select offer</option>
								<option v-for="o in offers" :key="o.id" :value="String(o.id)">{{ o.offerName }}</option>
							</select>
						</label>
						<label class="ff-control">
							<span>From</span>
							<input type="datetime-local" class="ff-field" v-model="form.startDate" />
						</label>
						<label class="ff-control">
							<span>Until</span>
							<input type="datetime-local" class="ff-field" v-model="form.endDate" />
						</label>
					</div>
					<div class="ff-detail__toolbar" style="margin-top:1rem;">
						<button type="button" class="ff-btn ff-btn--primary" @click="saveUnavailable">Save unavailable period</button>
					</div>
				</div>
				<div class="ff-filters">
					<div class="ff-segment" role="group" aria-label="Calendar range">
						<button type="button" class="ff-btn" :class="viewMode === 'week' ? 'ff-btn--primary' : 'ff-btn--ink'" @click="setMode('week')">Week</button>
						<button type="button" class="ff-btn" :class="viewMode === 'month' ? 'ff-btn--primary' : 'ff-btn--ink'" @click="setMode('month')">Month</button>
						<button type="button" class="ff-btn" :class="viewMode === 'year' ? 'ff-btn--primary' : 'ff-btn--ink'" @click="setMode('year')">Year</button>
					</div>
					<div class="ff-segment" style="margin-left:auto;">
						<button type="button" class="ff-btn ff-btn--ink" @click="shift(-1)">Prev</button>
						<button type="button" class="ff-btn ff-btn--ink" @click="goToday">Today</button>
						<button type="button" class="ff-btn ff-btn--ink" @click="shift(1)">Next</button>
					</div>
				</div>
				<p class="ff-filters__hint">{{ viewLabel }} · Bookings vs unavailable blocks</p>
				<p v-if="loading" class="ff-empty">Loading calendar…</p>
				<p v-else-if="error" class="ff-empty">{{ error }}</p>
				<template v-else>
					<div v-if="viewMode === 'month'" class="ff-cal-grid">
						<div class="ff-cal-head" v-for="d in weekDayNames" :key="'h'+d">{{ d }}</div>
						<div
							v-for="(cell, idx) in monthCells"
							:key="'c'+idx"
							class="ff-cal-cell"
							:class="{ 'is-muted': !cell.inMonth, 'is-today': cell.isToday }">
							<span class="ff-cal-day">{{ cell.day }}</span>
							<div v-for="r in cell.items" :key="(r.unavailable ? 'u' : 'r') + r.id" class="ff-cal-event" :class="{ 'ff-cal-event--unavailable': r.unavailable }" :title="eventTitle(r)">
								{{ shortName(r) }}
							</div>
						</div>
					</div>
					<div v-else-if="viewMode === 'week'" class="ff-cal-week">
						<div v-for="day in weekDays" :key="day.key" class="ff-cal-week-col">
							<strong>{{ day.label }}</strong>
							<article v-for="r in day.items" :key="(r.unavailable ? 'u' : 'r') + r.id" class="ff-product" :class="{ 'ff-cal-unavailable-card': r.unavailable }" style="margin-top:0.5rem;">
								<div class="ff-product__body">
									<h3>{{ offerName(r) }}</h3>
									<p class="ff-product__meta">{{ r.unavailable ? 'Unavailable' : clientName(r) }}</p>
									<p>{{ formatDate(r.startDate || r.startTime) }} – {{ formatDate(r.endDate || r.endTime) }}</p>
								</div>
							</article>
							<p v-if="!day.items.length" class="ff-empty" style="padding:0.5rem 0;">No bookings</p>
						</div>
					</div>
					<div v-else class="ff-cal-year">
						<div v-for="m in yearMonths" :key="m.key" class="ff-cal-year-month">
							<strong>{{ m.label }}</strong>
							<span class="ff-cal-badge">{{ m.count }} item{{ m.count === 1 ? '' : 's' }}</span>
							<ul>
								<li v-for="r in m.items" :key="(r.unavailable ? 'u' : 'r') + r.id" :class="{ 'ff-cal-unavailable-text': r.unavailable }">
									{{ r.unavailable ? 'Unavailable · ' : '' }}{{ offerName(r) }} — {{ formatDate(r.startDate || r.startTime) }}
								</li>
							</ul>
						</div>
					</div>
				</template>
			</section>
		</div>
	`,
	computed: {
		weekDayNames: function(){
			return ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
		},
		allItems: function(){
			return (this.reservations || []).concat(this.unavailabilities || []);
		},
		viewLabel: function(){
			var c = this.cursor;
			if (this.viewMode === 'week') {
				return 'Week of ' + this.formatDate(this.mondayOf(c));
			}
			if (this.viewMode === 'year') {
				return String(c.getFullYear());
			}
			return c.toLocaleString(undefined, { month: 'long', year: 'numeric' });
		},
		monthCells: function(){
			var year = this.cursor.getFullYear();
			var month = this.cursor.getMonth();
			var first = new Date(year, month, 1);
			var startOffset = (first.getDay() + 6) % 7;
			var start = new Date(year, month, 1 - startOffset);
			var today = new Date();
			var cells = [];
			for (var i = 0; i < 42; i++) {
				var d = new Date(start);
				d.setDate(start.getDate() + i);
				var key = this.dateKey(d);
				cells.push({
					day: d.getDate(),
					inMonth: d.getMonth() === month,
					isToday: this.sameDay(d, today),
					items: this.itemsOn(key)
				});
			}
			return cells;
		},
		weekDays: function(){
			var monday = this.mondayOf(this.cursor);
			var days = [];
			for (var i = 0; i < 7; i++) {
				var d = new Date(monday);
				d.setDate(monday.getDate() + i);
				days.push({
					key: this.dateKey(d),
					label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
					items: this.itemsOn(this.dateKey(d))
				});
			}
			return days;
		},
		yearMonths: function(){
			var year = this.cursor.getFullYear();
			var months = [];
			for (var m = 0; m < 12; m++) {
				var items = (this.allItems || []).filter(function(r){
					var start = new Date(r.startDate || r.startTime);
					return !isNaN(start.getTime()) && start.getFullYear() === year && start.getMonth() === m;
				});
				months.push({
					key: year + '-' + m,
					label: new Date(year, m, 1).toLocaleString(undefined, { month: 'long' }),
					count: items.length,
					items: items
				});
			}
			return months;
		}
	},
	methods: {
		setMode: function(mode){
			this.viewMode = mode;
		},
		goToday: function(){
			this.cursor = new Date();
		},
		shift: function(dir){
			var c = new Date(this.cursor);
			if (this.viewMode === 'week') {
				c.setDate(c.getDate() + dir * 7);
			} else if (this.viewMode === 'year') {
				c.setFullYear(c.getFullYear() + dir);
			} else {
				c.setMonth(c.getMonth() + dir);
			}
			this.cursor = c;
		},
		mondayOf: function(date){
			var d = new Date(date);
			var day = d.getDay() || 7;
			d.setHours(0,0,0,0);
			d.setDate(d.getDate() - day + 1);
			return d;
		},
		dateKey: function(d){
			return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
		},
		sameDay: function(a, b){
			return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
		},
		itemsOn: function(key){
			var self = this;
			return (this.allItems || []).filter(function(r){
				var start = new Date(r.startDate || r.startTime);
				var end = new Date(r.endDate || r.endTime || r.startDate || r.startTime);
				if (isNaN(start.getTime())) return false;
				if (isNaN(end.getTime())) end = start;
				var cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
				var last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
				while (cur <= last) {
					if (self.dateKey(cur) === key) return true;
					cur.setDate(cur.getDate() + 1);
				}
				return false;
			});
		},
		offerName: function(r){
			return r.offerName || (r.offer && r.offer.offerName) || 'Offer';
		},
		shortName: function(r){
			var prefix = r.unavailable ? '× ' : '';
			var n = this.offerName(r);
			var label = prefix + n;
			return label.length > 14 ? label.slice(0, 12) + '…' : label;
		},
		eventTitle: function(r){
			if (r.unavailable) {
				return 'Unavailable — ' + this.offerName(r);
			}
			return this.offerName(r) + ' — ' + this.clientName(r);
		},
		clientName: function(r){
			if (r.customer) {
				return ((r.customer.firstName || '') + ' ' + (r.customer.lastName || '')).trim() || r.customer.email || 'Client';
			}
			return r.clientName || 'Client';
		},
		formatDate: function(value){
			if (!value) return '—';
			var d = new Date(value);
			if (isNaN(d.getTime())) return String(value);
			return d.toLocaleString();
		},
		toApiDateTime: function(value){
			if (!value) return '';
			return String(value).length === 16 ? value + ':00' : value;
		},
		saveUnavailable: function(){
			var self = this;
			if (!this.form.offerId || !this.form.startDate || !this.form.endDate) {
				Swal.fire('Missing fields', 'Pick an offer and both dates.', 'error');
				return;
			}
			if (new Date(this.form.endDate) <= new Date(this.form.startDate)) {
				Swal.fire('Invalid range', 'End must be after start.', 'error');
				return;
			}
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			axios.post('/api/offerUnavailability', {
				offerId: String(this.form.offerId),
				startDate: this.toApiDateTime(this.form.startDate),
				endDate: this.toApiDateTime(this.form.endDate)
			}).then(function(response){
				if (response.data && response.data !== false) {
					Swal.fire('Saved', 'Unavailable period added.', 'success');
					self.form.startDate = '';
					self.form.endDate = '';
					self.loadUnavailabilities();
				} else {
					Swal.fire('Could not save', 'Check ownership and dates.', 'error');
				}
			}).catch(function(){
				Swal.fire('Could not save', 'Please try again later.', 'error');
			});
		},
		loadUnavailabilities: function(){
			var self = this;
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			return axios.get('/api/offerUnavailability')
				.then(function(response){
					self.unavailabilities = response.data || [];
				})
				.catch(function(){
					self.unavailabilities = [];
				});
		},
		loadOffers: function(){
			var self = this;
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			return axios.get('/api/ownerOffers')
				.then(function(response){
					self.offers = response.data || [];
					if (!self.form.offerId && self.offers.length) {
						self.form.offerId = String(self.offers[0].id);
					}
				})
				.catch(function(){
					self.offers = [];
				});
		},
		load: function(){
			var self = this;
			self.loading = true;
			self.error = '';
			axios.defaults.headers.common["Authorization"] = localStorage.getItem("user");
			Promise.all([
				axios.get('/api/ownerReservations'),
				self.loadUnavailabilities(),
				self.loadOffers()
			]).then(function(results){
				self.reservations = (results[0] && results[0].data) || [];
				self.loading = false;
			}).catch(function(){
				self.error = 'Could not load reservations.';
				self.loading = false;
			});
		}
	},
	mounted: function(){
		this.load();
	}
});
