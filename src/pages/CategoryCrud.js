import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import CategoryService from '../service/CategoryService';

const categoryService = new CategoryService();

export const CategoryCrud = () => {

    let emptyCategory = {
        id: null,
        name: ''
    };

    const [categories, setCategories] = useState(null);
    const [categoryDialog, setCategoryDialog] = useState(false);
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [category, setCategory] = useState(emptyCategory);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        categoryService.getAll().then(response => {
            setCategories(response.data)
        });
    }, []);

    const openNew = () => {
        setCategory(emptyCategory);
        setSubmitted(false);
        setCategoryDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setCategoryDialog(false);
    }

    const hideDeleteCategoryDialog = () => {
        setDeleteCategoryDialog(false);
    }

    
    const saveCategory = () => {

        if(category.hasOwnProperty('movieCategoryId')) {
            categoryService.update(category, category.movieCategoryId).then(response => {
                categoryService.getAll().then(response2 => {
                    setCategories(response2.data)
                });
                setCategoryDialog(false);
                setCategory(emptyCategory);
                setSubmitted(true);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de filme atualizada', life: 3000 });
            });    
        } else {
            categoryService.save(category).then(response => {
                categoryService.getAll().then(response2 => {
                    setCategories(response2.data)
                });
                setCategoryDialog(false);
                setCategory(emptyCategory);
                setSubmitted(true);
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de filme atualizada', life: 3000 });
            });
        }
        
    }

    const editCategory = (item) => {
        setCategory({ ...item });
        setCategoryDialog(true);
    }

    const confirmDeleteCategory = (item) => {
        setCategory(item);
        setDeleteCategoryDialog(true);
    }

    const deleteCategory = () => {
        
        categoryService.delete(category.movieCategoryId).then(() => {
            categoryService.getAll().then(response2 => {
                setCategories(response2.data)
            });
            setCategoryDialog(false);
            setCategory(emptyCategory);
            setSubmitted(true);
            setDeleteCategoryDialog(false);
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Categoria de filme excluída', life: 3000 });
        });
        
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _category = { ...category };
        _category[`${name}`] = val;

        setCategory(_category);
    }


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Novo" icon="pi pi-plus" className="p-button-success p-mr-2 p-mb-2" onClick={openNew} />
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Importar" chooseLabel="Importar" className="p-mr-2 p-d-inline-block" />
                <Button label="Exportar" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Name</span>
                {rowData.name}
            </>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editCategory(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteCategory(rowData)} />
            </div>
        );
    }

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Gerenciar Categorias de Filme</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const categoryDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Gravar" icon="pi pi-check" className="p-button-text" onClick={saveCategory} />
        </>
    );
    const deleteCategoryDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" className="p-button-text" onClick={hideDeleteCategoryDialog} />
            <Button label="Sim" icon="pi pi-check" className="p-button-text" onClick={deleteCategory} />
        </>
    );
    

    return (
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="p-mb-4 p-toolbar" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={categories} 
                        dataKey="movieCategoryId" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Unidade {first} de {last} das {totalRecords} unidades de negócio"
                        globalFilter={globalFilter} emptyMessage="Nenhuma categoria de filme encontrada." header={header}>
                        <Column field="name" header="Nome" sortable body={nameBodyTemplate}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={categoryDialog} style={{ width: '450px' }} 
                            header="Detalhes da Categoria de filme" modal className="p-fluid" 
                            footer={categoryDialogFooter} onHide={hideDialog}>
                        <div className="p-field">
                            <label htmlFor="name">Nome</label>
                            <InputText id="name" value={category.name} onChange={(e) => onInputChange(e, 'name')} 
                                required autoFocus className={classNames({ 'p-invalid': submitted && !category.name })} />
                            {submitted && !category.name && <small className="p-invalid">Nome é obrigatório.</small>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteCategoryDialog} style={{ width: '450px' }} 
                            header="Confirm" modal 
                            footer={deleteCategoryDialogFooter} onHide={hideDeleteCategoryDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {category && <span>Tem certeza que deseja excluir: <b>{category.name}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}
