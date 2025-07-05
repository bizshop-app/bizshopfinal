import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  UserPlus, 
  Settings, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  Clock, 
  X 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";

interface StoreManager {
  id: number;
  storeId: number;
  userId: number;
  permissions: {
    manageProducts: boolean;
    manageOrders: boolean;
    manageCategories: boolean;
    manageDiscounts: boolean;
    viewAnalytics: boolean;
  };
  invitedBy: number;
  invitedAt: string;
  acceptedAt?: string;
  status: 'pending' | 'accepted' | 'declined';
  user?: {
    username: string;
    email: string;
    fullName: string;
  };
}

interface StoreManagersProps {
  storeId: number;
}

export function StoreManagers({ storeId }: StoreManagersProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [permissions, setPermissions] = useState({
    manageProducts: true,
    manageOrders: true,
    manageCategories: false,
    manageDiscounts: false,
    viewAnalytics: false,
  });

  // Fetch store managers
  const { 
    data: managers, 
    isLoading,
    error 
  } = useQuery<StoreManager[]>({
    queryKey: ["/api/stores", storeId, "managers"],
  });

  // Invite manager mutation
  const inviteManagerMutation = useMutation({
    mutationFn: async (data: { email: string; permissions: any }) => {
      const res = await apiRequest("POST", `/api/stores/${storeId}/managers/invite`, data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores", storeId, "managers"] });
      setShowInviteDialog(false);
      setInviteEmail("");
      toast({
        title: "Invitation Sent",
        description: "Manager invitation has been sent successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send invitation",
        variant: "destructive",
      });
    },
  });

  // Remove manager mutation
  const removeManagerMutation = useMutation({
    mutationFn: async (managerId: number) => {
      const res = await apiRequest("DELETE", `/api/stores/${storeId}/managers/${managerId}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores", storeId, "managers"] });
      toast({
        title: "Manager Removed",
        description: "Store manager has been removed successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove manager",
        variant: "destructive",
      });
    },
  });

  // Update permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ managerId, permissions }: { managerId: number; permissions: any }) => {
      const res = await apiRequest("PATCH", `/api/stores/${storeId}/managers/${managerId}`, {
        permissions
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores", storeId, "managers"] });
      toast({
        title: "Permissions Updated",
        description: "Manager permissions have been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update permissions",
        variant: "destructive",
      });
    },
  });

  const handleInviteManager = () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    inviteManagerMutation.mutate({
      email: inviteEmail,
      permissions
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'declined':
        return <X className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const canInviteMoreManagers = managers ? managers.length < 3 : true;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading managers...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Store Managers
              </CardTitle>
              <CardDescription>
                Invite up to 3 managers to help run your store with limited access
              </CardDescription>
            </div>
            {canInviteMoreManagers && (
              <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Invite Manager
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite Store Manager</DialogTitle>
                    <DialogDescription>
                      Send an invitation to add a new manager to your store
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="manager@example.com"
                      />
                    </div>
                    
                    <div>
                      <Label>Permissions</Label>
                      <div className="mt-2 space-y-3">
                        {[
                          { key: 'manageProducts', label: 'Manage Products', description: 'Add, edit, and delete products' },
                          { key: 'manageOrders', label: 'Manage Orders', description: 'View and update order status' },
                          { key: 'manageCategories', label: 'Manage Categories', description: 'Create and organize categories' },
                          { key: 'manageDiscounts', label: 'Manage Discounts', description: 'Create and manage discount codes' },
                          { key: 'viewAnalytics', label: 'View Analytics', description: 'Access store analytics and reports' },
                        ].map((permission) => (
                          <div key={permission.key} className="flex items-start space-x-2">
                            <Checkbox
                              id={permission.key}
                              checked={permissions[permission.key as keyof typeof permissions]}
                              onCheckedChange={(checked) =>
                                setPermissions(prev => ({
                                  ...prev,
                                  [permission.key]: checked
                                }))
                              }
                            />
                            <div>
                              <Label htmlFor={permission.key} className="text-sm font-medium">
                                {permission.label}
                              </Label>
                              <p className="text-xs text-gray-600">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleInviteManager}
                      disabled={inviteManagerMutation.isPending}
                    >
                      {inviteManagerMutation.isPending ? "Sending..." : "Send Invitation"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!managers || managers.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Managers Yet</h3>
              <p className="text-gray-600 mb-4">
                Invite team members to help manage your store
              </p>
              {canInviteMoreManagers && (
                <Button onClick={() => setShowInviteDialog(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Your First Manager
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {managers.map((manager) => (
                  <TableRow key={manager.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{manager.user?.fullName || manager.user?.username}</p>
                        <p className="text-sm text-gray-600">{manager.user?.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(manager.status)}>
                        {getStatusIcon(manager.status)}
                        <span className="ml-1 capitalize">{manager.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {Object.entries(manager.permissions).map(([key, value]) => 
                          value && (
                            <Badge key={key} variant="outline" className="text-xs">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Badge>
                          )
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{new Date(manager.invitedAt).toLocaleDateString()}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {manager.status === 'pending' && (
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => removeManagerMutation.mutate(manager.id)}
                          disabled={removeManagerMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}