import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PatientEdit({ isEditing,handleSubmit,handleEdit,handleCancel,handleChange,patient={},errors={} }) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Paciente' : 'Información del Paciente'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            {isEditing ? (
              <Input
                id="name"
                name="name"
                value={patient.name || ''}
                onChange={handleChange}
                className={errors.name ? 'border-red-500' : ''}
              />
            ) : (
              <p className="mt-1">{patient.name || 'No disponible'}</p>
            )}
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div>
            <Label htmlFor="surname">Apellido</Label>
            {isEditing ? (
              <Input
                id="surname"
                name="surname"
                value={patient.surname || ''}
                onChange={handleChange}
                className={errors.surname ? 'border-red-500' : ''}
              />
            ) : (
              <p className="mt-1">{patient.surname || 'No disponible'}</p>
            )}
            {errors.surname && <p className="text-red-500 text-sm">{errors.surname}</p>}
          </div>
          <div>
            <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
            {isEditing ? (
              <Input
                id="birthdate"
                name="birthdate"
                type="date"
                value={patient.birthdate || ''}
                onChange={handleChange}
                className={errors.birthdate ? 'border-red-500' : ''}
              />
            ) : (
              <p className="mt-1">{patient.birthdate || 'No disponible'}</p>
            )}
            {errors.birthdate && <p className="text-red-500 text-sm">{errors.birthdate}</p>}
          </div>
          <div>
            <Label htmlFor="dni">DNI</Label>
            {isEditing ? (
              <Input
                id="dni"
                name="dni"
                value={patient.dni || ''}
                onChange={handleChange}
                className={errors.dni ? 'border-red-500' : ''}
              />
            ) : (
              <p className="mt-1">{patient.dni || 'No disponible'}</p>
            )}
            {errors.dni && <p className="text-red-500 text-sm">{errors.dni}</p>}
          </div>
          <div>
            <Label htmlFor="city">Ciudad</Label>
            {isEditing ? (
              <Input
                id="city"
                name="city"
                value={patient.city || ''}
                onChange={handleChange}
                className={errors.city ? 'border-red-500' : ''}
              />
            ) : (
              <p className="mt-1">{patient.city || 'No disponible'}</p>
            )}
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          {isEditing ? (
            <>
              <Button type="button" onClick={handleSubmit} className="w-1/2 mr-2">Guardar</Button>
              <Button type="button" onClick={handleCancel} className="w-1/2 ml-2" variant="outline">Cancelar</Button>
            </>
          ) : (
            <Button type="button" onClick={handleEdit} className="w-full">Editar</Button>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
