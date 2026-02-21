'use client';

import { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';
import { adminService } from '@/lib/api/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Camera, ShieldCheck, ShoppingBag, TrendingUp, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminPage() {
    const { isAuthenticated, customer } = useAuthStore();
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [faceStatus, setFaceStatus] = useState<'checking' | 'register' | 'verify' | 'verified'>('checking');
    const [faceMessage, setFaceMessage] = useState('Loading Face Models...');
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [categoryReport, setCategoryReport] = useState<any[]>([]);
    const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
    const [dashError, setDashError] = useState<string | null>(null);
    const [storedFaceData, setStoredFaceData] = useState<Float32Array | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !customer) {
            router.push('/auth/login');
            return;
        }
        if (customer.email !== 'admin@gmail.com') {
            alert('Access Denied');
            router.push('/');
            return;
        }

        const loadSystem = async () => {
            // Check admin status again inside to prevent async race conditions
            if (customer.email !== 'admin@gmail.com') return;

            try {
                // Check face status
                const status = await adminService.checkFaceStatus(customer.id);
                setFaceStatus(status.hasFaceData ? 'verify' : 'register');
                setFaceMessage(status.hasFaceData ? 'Please verify your face.' : 'First time: Register your face.');

                if (status.faceData) {
                    const parsed = JSON.parse(status.faceData);
                    setStoredFaceData(new Float32Array(parsed));
                }

                // Load Models
                const MODEL_URL = '/models';
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);

                // Final check before starting camera
                if (window.location.pathname.includes('/admin')) {
                    startVideo();
                }
            } catch (error) {
                console.error('Face System Error:', error);
                setFaceMessage('System Error. Please refresh.');
            } finally {
                setLoading(false);
            }
        };

        loadSystem();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [isAuthenticated, customer, router]);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => console.error(err));
    };

    const stopVideo = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    const handleFaceAction = async () => {
        if (!videoRef.current) return;
        setVerifying(true);
        setFaceMessage('Scanning...');

        try {
            // Use larger input size for better accuracy
            const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 512, scoreThreshold: 0.5 });
            const detection = await faceapi.detectSingleFace(videoRef.current, options)
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                setFaceMessage('No face detected. Try again.');
                setVerifying(false);
                return;
            }

            const descriptor = Array.from(detection.descriptor);

            if (faceStatus === 'register') {
                await adminService.registerFace(customer!.id, JSON.stringify(descriptor));
                stopVideo();
                setFaceStatus('verified');
                setFaceMessage('Registration Complete!');
                fetchDashboard();
            } else {
                // Verification: Compare current descriptor with stored one
                if (!storedFaceData) {
                    setFaceMessage('System error: Stored face data missing.');
                    setVerifying(false);
                    return;
                }

                const distance = faceapi.euclideanDistance(detection.descriptor, storedFaceData);
                console.log('Face Distance:', distance);

                // Standard threshold is 0.6, lower is stricter. Let's try 0.5 for better security.
                if (distance < 0.5) {
                    stopVideo();
                    setFaceStatus('verified');
                    setFaceMessage('Identity Verified!');
                    fetchDashboard();
                } else {
                    setFaceMessage(`Identity mismatch (dist: ${distance.toFixed(2)}). Please try again.`);
                    setVerifying(false);
                }
            }
        } catch (error: any) {
            console.error(error);
            setFaceMessage(`Error: ${error.response?.data?.error || 'Processing failed'}`);
        } finally {
            setVerifying(false);
        }
    };

    const fetchDashboard = async () => {
        setDashError(null);
        try {
            const [dash, report] = await Promise.all([
                adminService.getDashboard(),
                adminService.getCategoryReport()
            ]);
            setDashboardData(dash);
            setCategoryReport(report);
        } catch (error: any) {
            console.error(error);
            setDashError(error.response?.data?.error || 'Failed to load dashboard data.');
        }
    };

    const handleStockUpdate = async (productId: string) => {
        const val = stockInputs[productId];
        if (!val) return;
        try {
            await adminService.updateStock(productId, val);
            alert('Stock Updated');
            fetchDashboard();
            setStockInputs(prev => ({ ...prev, [productId]: 0 }));
        } catch (e) {
            alert('Failed to update stock');
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        try {
            await adminService.updateOrderStatus(orderId, status);
            let msg = `Order updated to ${status}`;
            if (status === 'PROCESSING') msg = 'Order Accepted';
            if (status === 'CANCELLED') msg = 'Order Rejected';
            if (status === 'DELIVERED') msg = 'Order marked as Delivered';
            alert(msg);
            fetchDashboard();
        } catch (e: any) {
            const errorMsg = e.response?.data?.error || 'Failed to update order status';
            alert(`Error: ${errorMsg}`);
        }
    };

    const handleResetFace = async () => {
        if (!confirm('Are you sure you want to delete your face fingerprint? You will need to re-register.')) return;
        try {
            await adminService.resetFace(customer!.id);
            setFaceStatus('register');
            setFaceMessage('Face data reset. Please re-register.');
            setStoredFaceData(null);
            startVideo();
        } catch (e) {
            alert('Failed to reset face data');
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

    if (faceStatus !== 'verified') {
        return (
            <div className="flex min-h-[80vh] items-center justify-center p-4">
                <Card className="w-full max-w-md border-2 border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <ShieldCheck className="mx-auto h-12 w-12 text-primary mb-2" />
                        <CardTitle>Admin Verification</CardTitle>
                        <CardDescription>{faceMessage}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/10 border-2 border-dashed border-gray-300">
                            <video ref={videoRef} autoPlay muted className="h-full w-full object-cover" />
                        </div>
                        <Button onClick={handleFaceAction} disabled={verifying} className="w-full" size="lg">
                            {verifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
                            {faceStatus === 'register' ? 'Register Face' : 'Verify Identity'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <Button variant="outline" size="sm" onClick={handleResetFace} className="text-xs text-red-500 hover:text-red-600">
                    Reset Face Fingerprint
                </Button>
            </div>

            {dashboardData ? (
                <div className="space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.products.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{dashboardData.orders.length}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">₹{Number(dashboardData.totalRevenue || 0).toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Inventory */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Inventory Management</CardTitle>
                                <CardDescription>Manage stock levels directly.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px] overflow-y-auto pr-2">
                                <div className="space-y-4">
                                    {dashboardData.products.map((product: any) => (
                                        <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                                            <div className="space-y-1">
                                                <p className="font-semibold">{product.name}</p>
                                                <p className="text-sm text-muted-foreground">Stock: <span className={product.stock < 10 ? 'text-red-500 font-bold' : 'text-green-600'}>{product.stock}</span></p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    placeholder="+/- Qty"
                                                    className="w-20 text-right"
                                                    value={stockInputs[product.id] || ''}
                                                    onChange={(e) => setStockInputs({ ...stockInputs, [product.id]: Number(e.target.value) })}
                                                />
                                                <Button size="sm" variant="outline" onClick={() => handleStockUpdate(product.id)}>Update</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Orders */}
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Latest customer purchases.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px] overflow-y-auto pr-2">
                                <div className="space-y-4">
                                    {dashboardData.orders.map((order: any) => (
                                        <div key={order.id} className="p-4 border rounded-lg space-y-3 bg-card">
                                            <div className="flex justify-between items-center">
                                                <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>{order.status}</span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{order.customer.firstName} {order.customer.lastName}</p>
                                                <p className="text-xs text-muted-foreground">{order.customer.email}</p>
                                                <p className="text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="border-t pt-2 mt-2 space-y-1">
                                                {order.orderItems.map((item: any) => (
                                                    <div key={item.id} className="flex justify-between text-xs">
                                                        <span>{item.product.name} x{item.quantity}</span>
                                                        <span>₹{Number(item.price || 0).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                                <div className="flex justify-between font-bold text-sm pt-1 border-t border-dashed">
                                                    <span>Total</span>
                                                    <span>₹{Number(order.total || 0).toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {order.status === 'PENDING' && (
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'PROCESSING')}
                                                    >
                                                        Accept
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="flex-1"
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                            {order.status === 'PROCESSING' && (
                                                <div className="flex gap-2 pt-2">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                                                    >
                                                        Mark as Delivered
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        className="flex-1"
                                                        onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Cursor Feature: Category Analytics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Category Analytics (DB Cursor)</CardTitle>
                            <CardDescription>Performance report generated using a PostgreSQL Cursor in a stored procedure.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {categoryReport.map((cat: any) => (
                                    <div key={cat.cat_name} className="p-4 border rounded-xl bg-gradient-to-br from-white to-gray-50 flex flex-col gap-1 shadow-sm">
                                        <p className="font-bold text-primary">{cat.cat_name}</p>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Value:</span>
                                            <span className="font-semibold text-green-600">₹{Number(cat.total_value).toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Items:</span>
                                            <span className="font-medium">{cat.total_items} units</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ) : dashError ? (
                <div className="flex flex-col items-center justify-center p-12 text-red-500 gap-4">
                    <p className="font-medium text-lg">{dashError}</p>
                    <Button onClick={fetchDashboard} variant="outline">Retry Loading Data</Button>
                </div>
            ) : (
                <div className="flex justify-center p-12 text-muted-foreground">Loading dashboard data...</div>
            )}
        </div>
    );
}

