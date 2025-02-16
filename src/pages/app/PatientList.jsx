import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import patientData from '@/utils/patientData';
import { Search, FileHeart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';

export function PatientTable() {

  const navigate = useNavigate();

  return (
    <div className='flex flex-col p-4 space-y-4 min-h-full min-w-full'> 
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Recent Patients</h2>
        <div className="flex items-center space-x-2">
          <Link to="/new-patient">
            <Button>Add New Patient</Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex items-center space-x-2">
          <Input placeholder="Search patients..." className="w-[300px]" />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Sort</Button>
        </div>
      </div>
      <Table>
        <TableHeader className>
          <TableRow>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Surname</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patientData.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.surname}</TableCell>
              <TableCell>
                <Badge variant={patient.status === 'fastQ stored' ? 'default' : 'secondary'}>{patient.status}</Badge>
              </TableCell>
              <TableCell className="flex items-center justify-center space-x-4">
                <Button variant="outline" onClick={() => navigate(`/app/history/${patient.id}`)}>
                  <FileHeart className="h-4 w-4" />
                  <span className="ml-2">View medical history</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

