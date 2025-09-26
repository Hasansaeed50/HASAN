import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Task } from "@shared/schema";
import { Plus, Trash2, List, Clock, CheckCircle, AlertCircle, Check } from "lucide-react";

export default function Home() {
  const [newTask, setNewTask] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();


  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/tasks", { text });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setNewTask("");
      toast({
        title: "تم إضافة المهمة بنجاح!",
        description: "تمت إضافة مهمة جديدة إلى قائمتك",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء إضافة المهمة",
        variant: "destructive",
      });
    },
  });

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PATCH", `/api/tasks/${id}/toggle`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "تم تحديث المهمة بنجاح!",
        description: "تم تغيير حالة المهمة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث المهمة",
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/tasks/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setSelectedTaskId(null);
      toast({
        title: "تم حذف المهمة بنجاح!",
        description: "تم حذف المهمة من قائمتك",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف المهمة",
        variant: "destructive",
      });
    },
  });

  const handleAddTask = () => {
    const trimmedTask = newTask.trim();
    if (!trimmedTask) {
      toast({
        title: "تنبيه",
        description: "الرجاء كتابة مهمة أولاً!",
        variant: "destructive",
      });
      return;
    }
    addTaskMutation.mutate(trimmedTask);
  };

  const handleDeleteTask = () => {
    if (!selectedTaskId) {
      toast({
        title: "تنبيه",
        description: "الرجاء اختيار مهمة لحذفها!",
        variant: "destructive",
      });
      return;
    }
    deleteTaskMutation.mutate(selectedTaskId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask();
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const taskDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "اليوم";
    if (diffDays === 1) return "أمس";
    if (diffDays === 2) return "منذ يومين";
    return `منذ ${diffDays} أيام`;
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
            <List className="text-primary" />
            مهامي اليومية
          </h1>
          <p className="text-muted-foreground text-lg">نظم مهامك اليومية بسهولة وفعالية</p>
        </div>

        {/* Task Form */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="task-input" className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  أضف مهمة جديدة
                </Label>
                <Input
                  id="task-input"
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="اكتب مهمتك هنا..."
                  className="text-right"
                  data-testid="input-new-task"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddTask}
                  disabled={addTaskMutation.isPending}
                  className="flex-1 flex items-center gap-2"
                  data-testid="button-add-task"
                >
                  <Plus className="w-4 h-4" />
                  {addTaskMutation.isPending ? "جاري الإضافة..." : "إضافة مهمة"}
                </Button>

                <Button
                  onClick={handleDeleteTask}
                  disabled={!selectedTaskId || deleteTaskMutation.isPending}
                  variant="destructive"
                  className="flex items-center gap-2"
                  data-testid="button-delete-task"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف المهمة
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <List className="text-primary" />
              قائمة المهام
              <Badge variant="secondary">{tasks.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-muted rounded-lg p-4 animate-pulse h-16" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-state">
                <div className="text-muted-foreground">
                  <List className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">لا توجد مهام حالياً</p>
                  <p className="text-sm">أضف مهمتك الأولى لتبدأ في تنظيم يومك</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`bg-background border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                      selectedTaskId === task.id
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border hover:border-primary/50"
                    } ${task.completed ? "opacity-70" : ""}`}
                    data-testid={`task-item-${task.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTaskMutation.mutate(task.id);
                          }}
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                            task.completed 
                              ? "border-green-500 bg-green-500 text-white" 
                              : "border-muted-foreground hover:border-primary"
                          }`}
                          data-testid={`checkbox-${task.id}`}
                          disabled={toggleTaskMutation.isPending}
                        >
                          {task.completed && <Check className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => setSelectedTaskId(task.id === selectedTaskId ? null : task.id)}
                          className="cursor-pointer flex-1 text-right"
                        >
                          <span className={`text-foreground ${task.completed ? "line-through" : ""}`} data-testid={`task-text-${task.id}`}>
                            {task.text}
                          </span>
                        </button>
                      </div>
                      <div className="text-muted-foreground text-sm flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(task.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Statistics */}
        <div className="mt-8">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary" data-testid="total-tasks">{tasks.length}</div>
                  <div className="text-sm text-muted-foreground">إجمالي المهام</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-green-600" data-testid="completed-tasks">{completedCount}</div>
                  <div className="text-sm text-muted-foreground">مهام مكتملة</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-amber-600" data-testid="pending-tasks">{pendingCount}</div>
                  <div className="text-sm text-muted-foreground">مهام معلقة</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-muted-foreground text-sm mt-4 text-center">
            مهامي اليومية - تطبيق إدارة المهام باللغة العربية
          </p>
        </div>
      </div>
    </div>
  );
}
