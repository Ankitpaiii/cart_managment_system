'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { addressesApi } from '@/lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, User, Plus, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function ProfilePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isAuthenticated, customer, logout } = useAuthStore();
    const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

    // Form state for new address
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
        isDefault: false
    });

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login?redirect=/profile');
        }
    }, [isAuthenticated, router]);

    const { data: addressesData, isLoading } = useQuery({
        queryKey: ['addresses'],
        queryFn: addressesApi.getAll,
        enabled: isAuthenticated,
    });

    const addresses = addressesData?.addresses || [];

    const addAddressMutation = useMutation({
        mutationFn: addressesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            setIsAddAddressOpen(false);
            setNewAddress({ street: '', city: '', state: '', zipCode: '', country: 'USA', isDefault: false });
        }
    });

    const deleteAddressMutation = useMutation({
        mutationFn: addressesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        }
    });

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!isAuthenticated || !customer) return null;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>

            <div className="grid gap-8 md:grid-cols-3">
                {/* Profile Section */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-12 w-12 text-primary" />
                            </div>
                            <CardTitle>{customer.firstName} {customer.lastName}</CardTitle>
                            <CardDescription>{customer.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">Member since</span>
                                <span>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <Separator />
                            <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200" onClick={handleLogout}>
                                Logout
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Addresses Section */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Shipping Addresses</CardTitle>
                                <CardDescription>Manage your delivery locations</CardDescription>
                            </div>
                            <Dialog open={isAddAddressOpen} onOpenChange={setIsAddAddressOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Address
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Add New Address</DialogTitle>
                                        <DialogDescription>
                                            Enter the details for your new shipping address.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="street">Street Address</Label>
                                            <Input
                                                id="street"
                                                value={newAddress.street}
                                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="city">City</Label>
                                                <Input
                                                    id="city"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="state">State</Label>
                                                <Input
                                                    id="state"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="zip">ZIP Code</Label>
                                                <Input
                                                    id="zip"
                                                    value={newAddress.zipCode}
                                                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="country">Country</Label>
                                                <Input
                                                    id="country"
                                                    value={newAddress.country}
                                                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            onClick={() => addAddressMutation.mutate(newAddress)}
                                            disabled={addAddressMutation.isPending}
                                        >
                                            {addAddressMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Save Address
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-4">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-neutral-300" />
                                </div>
                            ) : addresses && addresses.length > 0 ? (
                                <div className="grid gap-4">
                                    {addresses.map((address: any) => (
                                        <div key={address.id} className="flex items-start justify-between rounded-lg border p-4">
                                            <div className="flex gap-4">
                                                <div className="mt-1 rounded-full bg-neutral-100 p-2 text-neutral-500">
                                                    <MapPin className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-sm">{address.street}</p>
                                                        {address.isDefault && (
                                                            <Badge variant="outline" className="text-[10px] h-4 border-primary text-primary">Default</Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-neutral-500">
                                                        {address.city}, {address.state} {address.zipCode}
                                                    </p>
                                                    <p className="text-sm text-neutral-500">{address.country}</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-neutral-400 hover:text-red-500"
                                                onClick={() => deleteAddressMutation.mutate(address.id)}
                                                disabled={deleteAddressMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-neutral-50 rounded-lg border-2 border-dashed">
                                    <MapPin className="h-8 w-8 text-neutral-300 mx-auto mb-2" />
                                    <p className="text-neutral-500 italic">No addresses saved yet.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
