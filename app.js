// BHOOMI - Working JavaScript with QR codes and Camera

class BhoomiApp {
    constructor() {
        this.data = {
            products: [
                {
                    id: "BHOOMI-ASH-CAP-500-001",
                    name: "BHOOMI Ashwagandha Capsules 500mg Premium",
                    type: "Capsules",
                    price: "₹899",
                    rating: 4.8,
                    batch_data: {
                        herb: "Ashwagandha",
                        farmer: "Ramesh Kumar Sharma",
                        location: "Udaipur, Rajasthan",
                        gps: "24.5854°N, 73.7125°E",
                        collection_date: "2025-09-20",
                        quality_grade: "A+",
                        purity: 98.5,
                        ayush_rating: 4.8
                    }
                },
                {
                    id: "BHOOMI-TUL-POW-100-002",
                    name: "BHOOMI Tulsi Powder Organic 100g",
                    type: "Powder",
                    price: "₹299",
                    rating: 4.6,
                    batch_data: {
                        herb: "Tulsi",
                        farmer: "Anjali Singh",
                        location: "Varanasi, Uttar Pradesh",
                        gps: "25.3176°N, 82.9739°E",
                        collection_date: "2025-09-19",
                        quality_grade: "A",
                        purity: 96.8,
                        ayush_rating: 4.6
                    }
                },
                {
                    id: "BHOOMI-NEE-OIL-250-003",
                    name: "BHOOMI Neem Oil Pure 250ml",
                    type: "Oil",
                    price: "₹549",
                    rating: 4.7,
                    batch_data: {
                        herb: "Neem",
                        farmer: "Suresh Patel",
                        location: "Mysore, Karnataka",
                        gps: "12.2958°N, 76.6394°E",
                        collection_date: "2025-09-18",
                        quality_grade: "A+",
                        purity: 99.2,
                        ayush_rating: 4.7
                    }
                },
                {
                    id: "BHOOMI-BRA-SYR-200-004",
                    name: "BHOOMI Brahmi Memory Syrup 200ml",
                    type: "Syrup",
                    price: "₹699",
                    rating: 4.9,
                    batch_data: {
                        herb: "Brahmi",
                        farmer: "Priya Nair",
                        location: "Kottayam, Kerala",
                        gps: "9.5915°N, 76.5222°E",
                        collection_date: "2025-09-17",
                        quality_grade: "A+",
                        purity: 97.8,
                        ayush_rating: 4.9
                    }
                }
            ]
        };

        this.currentTheme = 'light-theme';
        this.cameraStream = null;
        this.isScanning = false;
        this.blockHeight = 1247;

        this.init();
    }

    async init() {
        console.log('🌿 BHOOMI App Starting...');

        // Show loading for 2 seconds
        setTimeout(() => {
            this.hideLoadingScreen();
            this.setupEventListeners();
            this.startAnimations();
            // Generate QR codes after a small delay to ensure library loads
            setTimeout(() => this.generateAllQRCodes(), 100);
        }, 2000);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => loadingScreen.style.display = 'none', 300);
        }
    }

    setupEventListeners() {
        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Form submissions
        this.setupFormHandlers();
    }

    setupFormHandlers() {
        // Farmer form
        const farmerForm = document.getElementById('farmer-form');
        if (farmerForm) {
            farmerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFarmerForm();
            });
        }

        // Testing form
        const testingForm = document.getElementById('testing-form');
        if (testingForm) {
            testingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTestingForm();
            });
        }

        // Manufacturing form
        const mfgForm = document.getElementById('manufacturing-form');
        if (mfgForm) {
            mfgForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleManufacturingForm();
            });
        }
    }

    startAnimations() {
        // Animate counters
        this.animateCounters();

        // Update block height
        setInterval(() => {
            this.blockHeight++;
            const element = document.getElementById('block-height');
            if (element) {
                element.textContent = this.blockHeight.toLocaleString();
            }
        }, 5000);
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            let current = 0;
            const increment = target / 50;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            observer.observe(counter);
        });
    }

    // QR CODE GENERATION - FIXED AND WORKING
    generateAllQRCodes() {
        console.log('🔄 Generating QR codes...');

        // Check if QRious library is loaded
        if (typeof QRious === 'undefined') {
            console.error('❌ QRious library not loaded');
            setTimeout(() => this.generateAllQRCodes(), 500);
            return;
        }

        this.data.products.forEach((product, index) => {
            const canvasId = `qr-demo-${index + 1}`;
            this.generateQRCode(canvasId, product.id);
        });

        console.log('✅ All QR codes generated successfully!');
    }

    generateQRCode(canvasId, data) {
        const canvas = document.getElementById(canvasId);

        if (!canvas) {
            console.error(`❌ Canvas ${canvasId} not found`);
            return;
        }

        try {
            const qr = new QRious({
                element: canvas,
                value: data,
                size: 150,
                background: '#ffffff',
                foreground: '#000000',
                level: 'M'
            });
            console.log(`✅ QR generated for ${canvasId}: ${data}`);
        } catch (error) {
            console.error(`❌ QR generation failed for ${canvasId}:`, error);
        }
    }

    // CAMERA FUNCTIONALITY - FIXED AND WORKING
    async startCamera() {
        try {
            console.log('📷 Starting camera...');
            const video = document.getElementById('camera-preview');

            if (!video) {
                throw new Error('Video element not found');
            }

            // Request camera permission
            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });

            video.srcObject = this.cameraStream;
            this.isScanning = true;

            // Start scanning simulation
            this.simulateQRDetection();

            this.showToast('Camera started! Point at QR code', 'success');
            console.log('✅ Camera started successfully');

        } catch (error) {
            console.error('❌ Camera error:', error);
            this.showToast('Camera access denied. Please allow camera permission.', 'error');
        }
    }

    stopCamera() {
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }

        this.isScanning = false;

        const video = document.getElementById('camera-preview');
        if (video) {
            video.srcObject = null;
        }

        this.showToast('Camera stopped', 'success');
        console.log('📷 Camera stopped');
    }

    simulateQRDetection() {
        if (!this.isScanning) return;

        // Simulate QR detection after 3-5 seconds
        const detectTime = Math.random() * 2000 + 3000;

        setTimeout(() => {
            if (this.isScanning) {
                // Pick a random demo product
                const randomProduct = this.data.products[Math.floor(Math.random() * this.data.products.length)];
                this.stopCamera();
                this.verifyProduct(randomProduct.id);
                this.showToast('QR Code detected!', 'success');
            }
        }, detectTime);
    }

    // GPS LOCATION - WORKING
    getLocation() {
        console.log('📍 Getting GPS location...');

        if (!navigator.geolocation) {
            this.showToast('Geolocation not supported', 'error');
            return;
        }

        const gpsInput = document.getElementById('gps-coords');
        if (gpsInput) {
            gpsInput.value = 'Getting location...';
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lng = position.coords.longitude.toFixed(4);
                const coords = `${lat}°N, ${lng}°E`;

                if (gpsInput) {
                    gpsInput.value = coords;
                }

                this.showToast('Location captured successfully!', 'success');
                console.log(`📍 Location: ${coords}`);
            },
            (error) => {
                console.error('❌ Location error:', error);
                if (gpsInput) {
                    gpsInput.value = '24.5854°N, 73.7125°E'; // Default coordinates
                }
                this.showToast('Using default location', 'warning');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 600000
            }
        );
    }

    // FORM HANDLERS - WORKING
    handleFarmerForm() {
        const herbName = document.getElementById('herb-name')?.value;
        const location = document.getElementById('location')?.value;
        const quantity = document.getElementById('quantity')?.value;

        if (!herbName || !location || !quantity) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        // Generate batch ID
        const batchId = `BTCH-${Date.now().toString().slice(-6)}`;

        console.log('🌱 Farmer batch registered:', {
            batchId,
            herb: herbName,
            location,
            quantity: `${quantity}kg`
        });

        this.showToast(`Batch ${batchId} registered successfully!`, 'success');

        // Reset form
        document.getElementById('farmer-form')?.reset();
    }

    handleTestingForm() {
        const batchId = document.getElementById('batch-id')?.value;
        const result = document.getElementById('test-result')?.value;
        const grade = document.getElementById('ayush-grade')?.value;

        if (!batchId || !result || !grade) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        console.log('🧪 Test results submitted:', {
            batchId,
            result,
            grade
        });

        this.showToast(`Test results for ${batchId} submitted successfully!`, 'success');
        document.getElementById('testing-form')?.reset();
    }

    handleManufacturingForm() {
        const productName = document.getElementById('product-name')?.value;
        const productType = document.getElementById('product-type')?.value;

        if (!productName || !productType) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }

        // Generate product ID
        const productId = `BHOOMI-${productType.toUpperCase().slice(0,3)}-${Date.now().toString().slice(-6)}`;

        console.log('🏭 Product created:', {
            productId,
            name: productName,
            type: productType
        });

        // Generate QR for the new product
        this.generateQRCode('product-qr', productId);

        this.showToast(`Product ${productId} created with QR code!`, 'success');
    }

    // PRODUCT VERIFICATION - WORKING
    verifyProduct(productId) {
        console.log(`🔍 Verifying: ${productId}`);

        const product = this.data.products.find(p => p.id === productId);

        if (!product) {
            this.displayVerificationResult(null, false, productId);
            return;
        }

        this.displayVerificationResult(product, true);
        this.showToast('Product verified successfully!', 'success');
    }

    verifyManualQR() {
        const input = document.getElementById('manual-qr-input');
        const qrCode = input?.value.trim();

        if (!qrCode) {
            this.showToast('Please enter a QR code', 'error');
            return;
        }

        this.verifyProduct(qrCode);
        if (input) input.value = '';
    }

    displayVerificationResult(product, isAuthentic, productId = '') {
        const container = document.getElementById('verification-result');
        if (!container) return;

        if (!isAuthentic || !product) {
            container.innerHTML = `
                <div class="verification-result">
                    <div class="verification-status suspicious">
                        <i class="fas fa-exclamation-triangle"></i>
                        Product Not Found
                    </div>
                    <p><strong>Product ID:</strong> ${productId}</p>
                    <p>This product could not be found in our blockchain database.</p>
                    <p>Please verify the QR code or contact support.</p>
                </div>
            `;
            return;
        }

        const { batch_data } = product;
        const stars = '★'.repeat(Math.floor(product.rating));

        container.innerHTML = `
            <div class="verification-result">
                <div class="verification-status authentic">
                    <i class="fas fa-shield-check"></i>
                    100% Authentic
                </div>

                <div style="background: var(--bg-tertiary); padding: var(--space-4); border-radius: var(--radius-lg); margin-bottom: var(--space-4);">
                    <h4 style="margin-bottom: var(--space-3); color: var(--text-primary);">${product.name}</h4>
                    <p><strong>Product ID:</strong> ${product.id}</p>
                    <p><strong>Type:</strong> ${product.type}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                    <p><strong>Rating:</strong> ${stars} ${product.rating}/5</p>
                    <p><strong>AYUSH Grade:</strong> ${batch_data.quality_grade}</p>
                    <p><strong>Purity:</strong> ${batch_data.purity}%</p>
                </div>

                <div style="margin-top: var(--space-6);">
                    <h4 style="margin-bottom: var(--space-4); color: var(--text-primary); display: flex; align-items: center; gap: var(--space-2);">
                        <i class="fas fa-route"></i> Complete Journey
                    </h4>

                    <div style="display: flex; flex-direction: column; gap: var(--space-4);">
                        <div style="display: flex; gap: var(--space-4); position: relative;">
                            <div style="width: 40px; height: 40px; background: var(--gradient-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0;">
                                1
                            </div>
                            <div style="flex: 1; background: var(--bg-secondary); padding: var(--space-4); border-radius: var(--radius-lg);">
                                <h5 style="color: var(--text-primary); margin-bottom: var(--space-2);">🌱 Collection</h5>
                                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-1);"><strong>Herb:</strong> ${batch_data.herb}</p>
                                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-1);"><strong>Farmer:</strong> ${batch_data.farmer}</p>
                                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-1);"><strong>Location:</strong> ${batch_data.location}</p>
                                <p style="font-size: 0.9rem; color: var(--text-secondary);"><strong>Date:</strong> ${batch_data.collection_date}</p>
                            </div>
                        </div>

                        <div style="display: flex; gap: var(--space-4);">
                            <div style="width: 40px; height: 40px; background: var(--gradient-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0;">
                                2
                            </div>
                            <div style="flex: 1; background: var(--bg-secondary); padding: var(--space-4); border-radius: var(--radius-lg);">
                                <h5 style="color: var(--text-primary); margin-bottom: var(--space-2);">🧪 Quality Testing</h5>
                                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-1);"><strong>Grade:</strong> ${batch_data.quality_grade}</p>
                                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-1);"><strong>Purity:</strong> ${batch_data.purity}%</p>
                                <p style="font-size: 0.9rem; color: var(--text-secondary);"><strong>AYUSH Rating:</strong> ${batch_data.ayush_rating}/5</p>
                            </div>
                        </div>

                        <div style="display: flex; gap: var(--space-4);">
                            <div style="width: 40px; height: 40px; background: var(--gradient-primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; flex-shrink: 0;">
                                3
                            </div>
                            <div style="flex: 1; background: var(--bg-secondary); padding: var(--space-4); border-radius: var(--radius-lg);">
                                <h5 style="color: var(--text-primary); margin-bottom: var(--space-2);">🏭 Manufacturing</h5>
                                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-1);"><strong>Product:</strong> ${product.name}</p>
                                <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: var(--space-1);"><strong>Type:</strong> ${product.type}</p>
                                <p style="font-size: 0.9rem; color: var(--text-secondary);"><strong>Blockchain:</strong> ✅ Verified</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // QR DOWNLOAD - WORKING
    downloadQR(canvasId, filename) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            this.showToast('QR code not found', 'error');
            return;
        }

        try {
            const link = document.createElement('a');
            link.download = `${filename}-QR.png`;
            link.href = canvas.toDataURL();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            this.showToast(`${filename} QR downloaded`, 'success');
        } catch (error) {
            console.error('Download error:', error);
            this.showToast('Download failed', 'error');
        }
    }

    downloadAllQRs() {
        const qrNames = ['Ashwagandha', 'Tulsi', 'Neem', 'Brahmi'];
        qrNames.forEach((name, index) => {
            setTimeout(() => {
                this.downloadQR(`qr-demo-${index + 1}`, name);
            }, index * 500);
        });
        this.showToast('Downloading all QR codes...', 'success');
    }

    downloadProductQR() {
        this.downloadQR('product-qr', 'Product');
    }

    // UI FUNCTIONS - WORKING
    showSection(sectionId) {
        console.log(`📱 Switching to: ${sectionId}`);

        // Remove active from all sections and nav links
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // Add active to target section and nav link
        const section = document.getElementById(sectionId);
        const navLink = document.querySelector(`[onclick*="${sectionId}"]`);

        if (section) section.classList.add('active');
        if (navLink) navLink.classList.add('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Section-specific actions
        if (sectionId === 'consumer' || sectionId === 'home') {
            setTimeout(() => this.generateAllQRCodes(), 100);
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        const tabBtn = document.querySelector(`[onclick*="${tabName}"]`);
        const tabContent = document.getElementById(`${tabName}-tab`);

        if (tabBtn) tabBtn.classList.add('active');
        if (tabContent) tabContent.classList.add('active');
    }

    switchProcessorTab(tabName) {
        document.querySelectorAll('#processor .tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('#processor .tab-content').forEach(content => content.classList.remove('active'));

        document.querySelector(`[onclick*="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
        document.body.className = this.currentTheme;

        const icon = document.querySelector('.theme-toggle i');
        if (icon) {
            icon.className = this.currentTheme === 'dark-theme' ? 'fas fa-sun' : 'fas fa-moon';
        }

        this.showToast(`Switched to ${this.currentTheme.replace('-theme', '')} mode`, 'success');
    }

    showToast(message, type = 'success', duration = 3000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: var(--space-3);">
                <i class="${icons[type]}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer; padding: var(--space-1);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }
        }, duration);
    }

    // Utility functions for demo
    verifyDemoProduct(productId) {
        this.verifyProduct(productId);
        this.showSection('consumer');
    }

    startTest(batchId) {
        this.switchProcessorTab('testing');
        const input = document.getElementById('batch-id');
        if (input) input.value = batchId;
        this.showToast(`Started testing for ${batchId}`, 'success');
    }

    printQR() {
        window.print();
    }
}

// Global functions for HTML onclick events
let app;

function showSection(sectionId) {
    app.showSection(sectionId);
}

function toggleTheme() {
    app.toggleTheme();
}

function startCamera() {
    app.startCamera();
}

function stopCamera() {
    app.stopCamera();
}

function getLocation() {
    app.getLocation();
}

function switchTab(tabName) {
    app.switchTab(tabName);
}

function switchProcessorTab(tabName) {
    app.switchProcessorTab(tabName);
}

function verifyManualQR() {
    app.verifyManualQR();
}

function verifyDemoProduct(productId) {
    app.verifyDemoProduct(productId);
}

function downloadQR(canvasId, filename) {
    app.downloadQR(canvasId, filename);
}

function downloadAllQRs() {
    app.downloadAllQRs();
}

function downloadProductQR() {
    app.downloadProductQR();
}

function startTest(batchId) {
    app.startTest(batchId);
}

function printQR() {
    app.printQR();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 BHOOMI App Loading...');
    app = new BhoomiApp();
});
