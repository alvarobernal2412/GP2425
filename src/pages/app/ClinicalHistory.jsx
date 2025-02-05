import '@/styles/history.css';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileIcon, ImageIcon, DownloadIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHistoryByPatientId } from '@/services/history';
import { useParams } from 'react-router-dom';
import { CardDiv, CardActions, AddIcon, EditConditionIcon, RemoveConditionIcon,
  EditIcon, RemoveIcon, UploadIcon, RemoveAllergyIcon, hasRole } from '@/components/history';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ConditionForm, TreatmentForm, FileForm, AllergyForm } from '@/forms/history/forms';
import { useConditionForm, handleConditionSubmit, handleDeleteCondition, 
  handleEditCondition, useTreatmentForm, handleTreatmentSubmit, handleEditTreatment, handleDeleteTreatment,
  handleUploadAnalytic, handleDeleteAnalytic, handleAddAllergy, handleDeleteAllergy, handleUploadImage,
  handleDeleteImage, handleGetReport
} from '@/utils/historyUtils';
import { useForm } from 'react-hook-form';

function Conditions({ conditions, historyId, updateHistoryPart }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useConditionForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);

  const handleOpenDialog = (condition = null) => {
    
    if (condition) {
      setSelectedCondition(condition);
      form.reset({
        ...condition,
        since: condition.since ? new Date(condition.since).toISOString().split('T')[0] : '',
        until: condition.until ? new Date(condition.until).toISOString().split('T')[0] : '',
      });
      setIsEditing(true);
    } else {
      form.reset({
        name: '',
        details: '',
        since: 'dd/mm/aaaa',
        until: 'dd/mm/aaaa',
      }
      );
      setIsEditing(false);
      setSelectedCondition(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedCondition(null);
  };

  const onSubmit = (values) => {
    if (isEditing && selectedCondition) {
      handleEditCondition(historyId, selectedCondition._id, values, handleCloseDialog, updateHistoryPart, setIsLoading, setError);
    } else {
      handleConditionSubmit(historyId, values, handleCloseDialog, updateHistoryPart, setIsLoading, setError);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardDiv>
          <CardTitle>Conditions</CardTitle>
          <CardActions>
            <AddIcon onClick={() => handleOpenDialog()} />
          </CardActions>
        </CardDiv>
        <CardDescription>Current and past medical conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {conditions.map((condition, index) => (
            <li key={index} className="bg-muted p-4 rounded-lg">
              <CardDiv>
                <h3 className="font-semibold text-lg">{condition.name}</h3>
                <CardActions>
                  <EditConditionIcon onClick={() => handleOpenDialog(condition)} />
                  <RemoveConditionIcon onClick={() => handleDeleteCondition(historyId, condition._id, updateHistoryPart, setError)} />
                </CardActions>
              </CardDiv>
              <p className="text-sm text-muted-foreground">{condition.details}</p>
              <p className="text-sm text-muted-foreground mt-2">Since: {new Date(condition.since).toLocaleDateString('en-CA')}</p>
              {condition.until && <p className="text-sm text-muted-foreground">Until: {new Date(condition.until).toLocaleDateString('en-CA')}</p>}
            </li>
          ))}
        </ul>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Condition' : 'Add Condition'}</DialogTitle>
            <DialogClose onClick={handleCloseDialog} />
          </DialogHeader>
          <ConditionForm form={form} onSubmit={onSubmit} isLoading={isLoading} error={error} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Treatments({ treatments, historyId, updateHistoryPart }) {
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useTreatmentForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);

  const handleOpenDialog = (treatment = null) => {
    
    if (treatment) {
      setSelectedTreatment(treatment);
      form.reset({
        ...treatment,
        startDate: treatment.startDate ? new Date(treatment.startDate).toISOString().split('T')[0] : '',
        endDate: treatment.endDate ? new Date(treatment.endDate).toISOString().split('T')[0] : '',
      });
      setIsEditing(true);
    } else {
      form.reset({
        name: '',
        instructions: '',
        startDate: 'dd/mm/aaaa',
        endDate: 'dd/mm/aaaa',
      }
      );
      setIsEditing(false);
      setSelectedTreatment(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setIsEditing(false);
    setSelectedTreatment(null);
  };

  const onSubmit = (values) => {
    if (isEditing && selectedTreatment) {
      handleEditTreatment(historyId, selectedTreatment._id, values, handleCloseDialog, updateHistoryPart, setIsLoading, setError);
    } else {
      handleTreatmentSubmit(historyId, values, handleCloseDialog, updateHistoryPart, setIsLoading, setError);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardDiv>
          <CardTitle>Treatments</CardTitle>
          <CardActions>
            <AddIcon onClick={handleOpenDialog} />
          </CardActions>
        </CardDiv>
        <CardDescription>Current and past treatments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Instructions</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {treatments.map((treatment, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{treatment.name}</TableCell>
                  <TableCell>{new Date(treatment.startDate).toLocaleDateString('en-CA')}</TableCell>
                  <TableCell>{new Date(treatment.endDate).toLocaleDateString('en-CA')}</TableCell>
                  <TableCell>{treatment.instructions}</TableCell>
                  <TableCell className="flex items-center space-x-3">
                    <CardActions>
                      <EditIcon onClick={() => handleOpenDialog(treatment)} />
                      <RemoveIcon onClick={() => handleDeleteTreatment(historyId, treatment._id, updateHistoryPart, setError)} />
                    </CardActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Treatment' : 'Add Treatment'}</DialogTitle>
            <DialogClose onClick={handleCloseDialog} />
          </DialogHeader>
          <TreatmentForm form={form} onSubmit={onSubmit} isLoading={isLoading} error={error} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Analytics({ analytics = [], historyId, updateHistoryPart }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const form = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileSelected(!!file);
    form.setValue('file', file);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFileSelected(false);
    form.reset({'file': null});
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file);
    setIsLoading(true);
    try {
      await handleUploadAnalytic(historyId, formData, handleCloseDialog, updateHistoryPart, setIsLoading, setError);
    } catch (error) {
      setError('Failed to upload file');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardDiv>
          <CardTitle>Analytics</CardTitle>
          <CardActions>
            <UploadIcon onClick={handleOpenDialog} />
          </CardActions>
        </CardDiv>
        <CardDescription>Medical analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {analytics.length > 0 ? (
            analytics.map((analysis, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileIcon className="h-5 w-5" style={{ color: 'var(--doc-icon-color)' }} />
                  <span>{analysis.originalName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{new Date(analysis.date).toLocaleString('en-CA', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={analysis.url} target="_blank" rel="noopener noreferrer">View</a>
                  </Button>
                  <RemoveIcon onClick={() => handleDeleteAnalytic(historyId, analysis._id, updateHistoryPart, setIsLoading, setError)} className="cursor-pointer" />
                </div>
              </li>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No analytics available.</p>
          )}
        </ul>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) handleCloseDialog();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'Upload Analytic'}</DialogTitle>
            <DialogClose onClick={handleCloseDialog} />
          </DialogHeader>
          <FileForm form={form} onSubmit={onSubmit} isLoading={isLoading} error={error} onChange={handleFileChange} fileSelected={fileSelected} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Images({ images, historyId, updateHistoryPart }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const form = useForm();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileSelected(!!file);
    form.setValue('file', file);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFileSelected(false);
    form.reset({'file': null});
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('file', data.file);
    setIsLoading(true);
    try {
      await handleUploadImage(historyId, formData, handleCloseDialog, updateHistoryPart, setIsLoading, setError);
    } catch (error) {
      setError('Failed to upload file');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardDiv>
          <CardTitle>Images</CardTitle>
          <CardActions>
            <UploadIcon onClick={handleOpenDialog} />
          </CardActions>
        </CardDiv>
        <CardDescription>Medical Images</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {images.map((image, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="h-5 w-5 min-w-[20px] min-h-[20px]" style={{ color: 'var(--img-icon-color)' }}/>
                <span>{image.originalName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{new Date(image.date).toLocaleString('en-CA', { dateStyle: 'short', timeStyle: 'short' })}</span>
                <Button variant="outline" size="sm" asChild>
                  <a href={image.url} target="_blank" rel="noopener noreferrer">View</a>
                </Button>
                <RemoveIcon onClick={() => handleDeleteImage(historyId, image._id, updateHistoryPart, setIsLoading, setError)} className="cursor-pointer" />
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) handleCloseDialog();
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'Upload Image'}</DialogTitle>
            <DialogClose onClick={handleCloseDialog} />
          </DialogHeader>
          <FileForm form={form} onSubmit={onSubmit} isLoading={isLoading} error={error} onChange={handleFileChange} fileSelected={fileSelected} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Allergies({ allergies, historyId, updateHistoryPart }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      allergy: '',
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    form.reset();
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const onSubmit = (data) => {
    setIsLoading(true);
    handleAddAllergy(historyId, data, handleCloseDialog, updateHistoryPart, setIsLoading, setError);
  };

  return (
    <Card>
      <CardHeader>
        <CardDiv>
          <CardTitle>Allergies</CardTitle>
          <CardActions> 
            <AddIcon onClick={handleOpenDialog}/>
          </CardActions>
        </CardDiv>
        <CardDescription>Known allergies and sensitivities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {allergies.map((allergy, index) => (
            <Badge key={index} variant="secondary" className="flex items-center space-x-2 p-1 text-xs">
              <span>{allergy}</span>
              <RemoveAllergyIcon onClick={() => handleDeleteAllergy(historyId, allergy, updateHistoryPart, setIsLoading, setError)} className="cursor-pointer" />
            </Badge>
          ))}
        </div>
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{'Upload Analytic'}</DialogTitle>
            <DialogClose onClick={handleCloseDialog} />
          </DialogHeader>
          <AllergyForm form={form} onSubmit={onSubmit} isLoading={isLoading} error={error}/>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function ClinicalHistory() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyId, setHistoryId] = useState('');
  const [conditions, setConditions] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [images, setImages] = useState([]);
  const [allergies, setAllergies] = useState([]);

  const updateHistoryPart = (part, data) => {
    switch (part) {
    case 'conditions':
      setConditions(data);
      break;
    case 'treatments':
      setTreatments(data);
      break;
    case 'analytics':
      setAnalytics(data);
      break;
    case 'images':
      setImages(data);
      break;
    case 'allergies':
      setAllergies(data);
      break;
    default:
      break;
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      getHistoryByPatientId(id)
        .then((response) => {
          const data = response.data;
          setHistoryId(data._id);
          setConditions(data.currentConditions);
          setTreatments(data.treatments);
          setAnalytics(data.analytics);
          setImages(data.images);
          setAllergies(data.allergies);
        })
        .catch((err) => {
          setError('An error occurred. Please try again later.');
          console.error(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    fetchHistory();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="container mx-auto py-8 px-4 text-left">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patient Clinical History</h1>
        {hasRole(['clinicadmin', 'doctor', 'patient']) && (
          <Button variant="outline" className="px-4 py-2 text-base" onClick={() => handleGetReport(historyId, setIsLoading, setError)}>
            <DownloadIcon className="mr-2 h-5 w-5" />
            Report
          </Button>
        )}
      </div>
      <div className="space-y-6">
        <Conditions conditions={conditions} historyId={historyId} updateHistoryPart={updateHistoryPart}/>
        <Treatments treatments={treatments} historyId={historyId} updateHistoryPart={updateHistoryPart}/>
        <Analytics analytics={analytics} historyId={historyId} updateHistoryPart={updateHistoryPart}/>
        <Images images={images} historyId={historyId} updateHistoryPart={updateHistoryPart} />
        <Allergies allergies={allergies} historyId={historyId} updateHistoryPart={updateHistoryPart} />
      </div>
    </div>
  );
}