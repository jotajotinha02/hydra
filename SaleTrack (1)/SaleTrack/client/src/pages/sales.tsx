import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Sale } from "@shared/schema";

const saleFormSchema = z.object({
  usuario: z.string().min(1, "Usuário é obrigatório"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  valor: z.number().min(0.01, "Valor deve ser maior que 0"),
});

type SaleFormData = z.infer<typeof saleFormSchema>;

export default function Sales() {
  const { toast } = useToast();
  const [filtroUsuario, setFiltroUsuario] = useState<string>("todos");
  const [filtroData, setFiltroData] = useState<string>("");

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      usuario: "",
      quantidade: 1,
      valor: 0,
    },
  });

  const { data: sales = [], isLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const createSaleMutation = useMutation({
    mutationFn: async (data: SaleFormData) => {
      const response = await apiRequest("POST", "/api/sales", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      form.reset();
      toast({
        title: "Sucesso",
        description: "Venda registrada com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao registrar venda. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deleteSaleMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/sales/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      toast({
        title: "Sucesso",
        description: "Venda removida com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover venda. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SaleFormData) => {
    createSaleMutation.mutate(data);
  };

  const handleDelete = (id: string) => {
    deleteSaleMutation.mutate(id);
  };

  // Filter sales based on selected criteria
  const filteredSales = sales.filter((sale) => {
    let matches = true;

    if (filtroUsuario && filtroUsuario !== "todos" && sale.usuario !== filtroUsuario) {
      matches = false;
    }

    if (filtroData) {
      const saleDate = new Date(sale.data).toISOString().split('T')[0];
      if (saleDate !== filtroData) {
        matches = false;
      }
    }

    return matches;
  });

  // Calculate totals
  const totalValue = filteredSales.reduce((sum, sale) => sum + parseFloat(sale.valor), 0);
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + sale.quantidade, 0);

  // Get unique users for filter dropdown
  const uniqueUsers = Array.from(new Set(sales.map(sale => sale.usuario)));

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '30px', backgroundColor: '#f4f4f4' }}>
      <h1 style={{ color: '#333' }}>Registro de Vendas</h1>

      {/* Registration Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} style={{ marginBottom: '20px' }}>
          <FormField
            control={form.control}
            name="usuario"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    placeholder="Usuário" 
                    {...field} 
                    style={{
                      padding: '10px',
                      margin: '5px 0',
                      width: '100%',
                      maxWidth: '300px',
                      boxSizing: 'border-box'
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantidade"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Quantidade" 
                    min="1" 
                    step="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    style={{
                      padding: '10px',
                      margin: '5px 0',
                      width: '100%',
                      maxWidth: '300px',
                      boxSizing: 'border-box'
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Valor Total (R$)" 
                    min="0.01" 
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    style={{
                      padding: '10px',
                      margin: '5px 0',
                      width: '100%',
                      maxWidth: '300px',
                      boxSizing: 'border-box'
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={createSaleMutation.isPending}
            style={{
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '10px',
              margin: '5px 0',
              width: '100%',
              maxWidth: '300px',
              boxSizing: 'border-box'
            }}
          >
            Registrar Venda
          </Button>
        </form>
      </Form>

      {/* Date Filter */}
      <h3 style={{ color: '#333' }}>Filtrar por data:</h3>
      <Input 
        type="date" 
        value={filtroData}
        onChange={(e) => setFiltroData(e.target.value)}
        style={{
          padding: '10px',
          margin: '5px 0',
          width: '100%',
          maxWidth: '300px',
          boxSizing: 'border-box'
        }}
      />

      {/* User Filter */}
      <h3 style={{ color: '#333' }}>Filtrar por usuário:</h3>
      <Select value={filtroUsuario} onValueChange={setFiltroUsuario}>
        <SelectTrigger style={{
          padding: '10px',
          margin: '5px 0',
          width: '100%',
          maxWidth: '300px',
          boxSizing: 'border-box'
        }}>
          <SelectValue placeholder="Todos os usuários" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os usuários</SelectItem>
          {uniqueUsers.map(user => (
            <SelectItem key={user} value={user}>{user}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Total Info */}
      <div style={{
        marginTop: '20px',
        padding: '10px',
        fontWeight: 'bold',
        backgroundColor: '#e0f2f7',
        borderLeft: '5px solid #2196f3',
        color: '#333',
        maxWidth: '590px'
      }}>
        Total de vendas filtradas: R$ {totalValue.toFixed(2)} | Quantidade: {totalQuantity}
      </div>

      {/* Sales Table */}
      <Table style={{
        marginTop: '20px',
        borderCollapse: 'collapse',
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
        <TableHeader>
          <TableRow>
            <TableHead style={{
              padding: '12px',
              border: '1px solid #eee',
              textAlign: 'left',
              backgroundColor: '#f8f8f8',
              fontWeight: 'bold'
            }}>Usuário</TableHead>
            <TableHead style={{
              padding: '12px',
              border: '1px solid #eee',
              textAlign: 'left',
              backgroundColor: '#f8f8f8',
              fontWeight: 'bold'
            }}>Qtd</TableHead>
            <TableHead style={{
              padding: '12px',
              border: '1px solid #eee',
              textAlign: 'left',
              backgroundColor: '#f8f8f8',
              fontWeight: 'bold'
            }}>Valor</TableHead>
            <TableHead style={{
              padding: '12px',
              border: '1px solid #eee',
              textAlign: 'left',
              backgroundColor: '#f8f8f8',
              fontWeight: 'bold'
            }}>Data</TableHead>
            <TableHead style={{
              padding: '12px',
              border: '1px solid #eee',
              textAlign: 'left',
              backgroundColor: '#f8f8f8',
              fontWeight: 'bold'
            }}>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} style={{
                padding: '12px',
                border: '1px solid #eee',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                Carregando...
              </TableCell>
            </TableRow>
          ) : filteredSales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} style={{
                padding: '12px',
                border: '1px solid #eee',
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                {filtroData ? `Nenhuma venda encontrada para a data: ${filtroData}` : "Nenhuma venda registrada ainda."}
              </TableCell>
            </TableRow>
          ) : (
            filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell style={{
                  padding: '12px',
                  border: '1px solid #eee',
                  textAlign: 'left'
                }}>{sale.usuario}</TableCell>
                <TableCell style={{
                  padding: '12px',
                  border: '1px solid #eee',
                  textAlign: 'left'
                }}>{sale.quantidade}</TableCell>
                <TableCell style={{
                  padding: '12px',
                  border: '1px solid #eee',
                  textAlign: 'left'
                }}>R$ {parseFloat(sale.valor).toFixed(2)}</TableCell>
                <TableCell style={{
                  padding: '12px',
                  border: '1px solid #eee',
                  textAlign: 'left'
                }}>{new Date(sale.data).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell style={{
                  padding: '12px',
                  border: '1px solid #eee',
                  textAlign: 'left'
                }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(sale.id)}
                    style={{
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px 10px'
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}