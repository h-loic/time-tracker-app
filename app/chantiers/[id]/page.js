'use client';
import { collection } from "firebase/firestore";
import { doc,getDoc, getDocs, setDoc, updateDoc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {db} from '../../firebase'
import { useEffect, useState } from 'react';
import Link from 'next/link'
import NavBar from '../../../components/navBar';
import { useRouter } from 'next/navigation'
import { FaTrashAlt } from 'react-icons/fa';
import ExcelJS from 'exceljs';

export default function Details({params : {id}}) {

    const router = useRouter();

    const [chantier, setChantier] = useState(null);
    const [workers, setWorkers] = useState([])
    const [tasks, setTasks] = useState([])
    const [newNote,setNewNote] = useState("")
  
    useEffect(() => {
      if (id) {
        // Récupérer la tâche spécifique depuis Firestore en fonction de l'ID
        const docRef = doc(db, "chantiers", id);
        const fetchData = async () => {
          const docSnap = await getDoc(docRef);
          const a = docSnap.data();
          setChantier(a);
        }
        fetchData();

        const getTasks = async () => {
          const query2 = await getDocs(collection(db,`chantiers/${id}/tasks`))
          let tasks = []
          query2.forEach(element => {
            tasks.push(element.data())
          })
          setTasks(tasks);
        }
        getTasks();

        const getWorkers = async () => {
          const query = await getDocs(collection(db, `chantiers/${id}/workers`))
          let workersfetch = []
          query.forEach(element => {
            workersfetch.push(element.data())
          });
          setWorkers(workersfetch);
        }

        getWorkers();
      }
    }, [id]);

    const changeFinishedStatus = async () => {
      await updateDoc(doc(db, 'chantiers', id), {
          isFinished : !chantier.isFinished
      })
      setChantier({
        name : chantier.name,
        budget : chantier.budget,
        totalHours : chantier.totalHours,
        availableHours : chantier.availableHours,
        usedHours : chantier.usedHours,
        isFinished : !chantier.isFinished
      })
    };

    
    const deleteChantier = () => {
      const docRef = doc(db, "chantiers", id);
      deleteDoc(docRef).then(() => router.back())
    }

    const addNote = async () => {
      const docRef = doc(db, "chantiers", id);
      await updateDoc(docRef, {
        notes : arrayUnion(newNote)
      })
      const updatedChantier = { ...chantier, notes: [...chantier.notes, newNote] };
      setChantier(updatedChantier)
      setNewNote("");
    }

    const deleteNote = async (noteToDelete) => {
      const docRef = doc(db, "chantiers", id);
      await updateDoc(docRef, {
        notes : arrayRemove(noteToDelete)
      })

      const updatedChantier = { ...chantier, notes: chantier.notes.filter((note) => note !== noteToDelete )};
      setChantier(updatedChantier);
    }

    const downloadExcel = () => {

      let workbook = new ExcelJS.Workbook();
      let worksheet = workbook.addWorksheet(chantier.name);


      worksheet.addRow([1]);

      worksheet.mergeCells('A1:B1');
      worksheet.getCell('A1').value = chantier.name;
      worksheet.getCell('A1').font = {bold : true};
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').style.font = { size: 20 };
      worksheet.getCell('A1').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1E8449 ' }, 
      };
      worksheet.getCell('A1').style.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      worksheet.mergeCells('A3:B3');
      worksheet.getCell('A3').value = "Informations générales";
      worksheet.getCell('A3').font = {bold : true};
      worksheet.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A3').style.font = { size: 14 };
      worksheet.getCell('A3').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '52BE80 ' },
      };
      worksheet.getCell('A3').style.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };

      worksheet.getCell('A4').value = "Addresse"
      worksheet.getCell('B4').value = chantier.address
      worksheet.getCell('B4').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A4').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
      worksheet.getCell('B4').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.getCell('A5').value = "Quoi"
      worksheet.getCell('B5').value = chantier.type
      worksheet.getCell('B5').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A5').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
      worksheet.getCell('B5').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.getCell('A6').value = "Budget"
      worksheet.getCell('B6').value = chantier.budget
      worksheet.getCell('B6').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A6').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
      worksheet.getCell('B6').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.getCell('A7').value = "Quoi"
      worksheet.getCell('B7').value = chantier.type
      worksheet.getCell('B7').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A7').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
      worksheet.getCell('B7').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.getCell('A8').value = "Nombre d'heures total"
      worksheet.getCell('B8').value = chantier.totalHours
      worksheet.getCell('B8').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A8').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
      worksheet.getCell('B8').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.getCell('A9').value = "Nombre d'heures restantes"
      worksheet.getCell('B9').value = chantier.availableHours
      worksheet.getCell('B9').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A9').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
      worksheet.getCell('B9').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.getCell('A10').value = "Nombre heures utilisés"
      worksheet.getCell('B10').value = chantier.usedHours
      worksheet.getCell('B10').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A10').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
      worksheet.getCell('B10').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.getCell('A11').value = "Chantier terminé ?"
      worksheet.getCell('B11').value = chantier.isFinished ? "oui" : "non"
      worksheet.getCell('B11').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A11').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
      worksheet.getCell('B11').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.mergeCells('A13:B13');
      worksheet.getCell('A13').value = "Répartitions des heures";
      worksheet.getCell('A13').font = {bold : true};
      worksheet.getCell('A13').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A13').style.font = { size: 14 };
      worksheet.getCell('A13').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '52BE80 ' },
      };
      worksheet.getCell('A13').style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};


      let cellIndex = 14;
      tasks.forEach(task => {
        if (task.hours != 0){
          worksheet.getCell('A' + cellIndex).value = task.task
          worksheet.getCell('B' + cellIndex).value = task.hours
          worksheet.getCell('B' + cellIndex).alignment = { horizontal: 'center', vertical: 'middle' };
          worksheet.getCell('A' + cellIndex).style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
          worksheet.getCell('B' + cellIndex).style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
          cellIndex++
        }
      });

      cellIndex++;

      worksheet.getCell('A' + cellIndex).value = "Ouvriers ayant participés";
      worksheet.getCell('A' + cellIndex).font = {bold : true};
      worksheet.getCell('A' + cellIndex).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A' + cellIndex).style.font = { size: 14 };
      worksheet.getCell('A' + cellIndex).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '52BE80 ' },
      };
      worksheet.getCell('A' + cellIndex).style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      worksheet.getCell('B' + cellIndex).value = "Nombres d'heures travaillés";
      worksheet.getCell('B' + cellIndex).font = {bold : true};
      worksheet.getCell('B' + cellIndex).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('B' + cellIndex).style.font = { size: 14 };
      worksheet.getCell('B' + cellIndex).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '52BE80 ' },
      };
      worksheet.getCell('B' + cellIndex).style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};

      cellIndex++;

      workers.forEach(worker => {
        worksheet.getCell('A' + cellIndex).value = worker.name;
        worksheet.getCell('B' + cellIndex).value = worker.workedHours;
        worksheet.getCell('B' + cellIndex).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A' + cellIndex).style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
        worksheet.getCell('B' + cellIndex).style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
        cellIndex++;
      });


      if (chantier.notes.length != 0){
        cellIndex++
        worksheet.mergeCells('A'+ cellIndex +':B' + cellIndex);
        worksheet.getCell('A' + cellIndex).value = "Notes";
        worksheet.getCell('A' + cellIndex).font = {bold : true};
        worksheet.getCell('A' + cellIndex).alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A' + cellIndex).style.font = { size: 14 };
        worksheet.getCell('A' + cellIndex).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '52BE80 ' },
        };
        worksheet.getCell('A' + cellIndex).style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};


        cellIndex++

        chantier.notes.forEach(note => {
          worksheet.mergeCells('A'+ cellIndex +':B' + cellIndex);
          worksheet.getCell('A' + cellIndex).value = note;
          worksheet.getCell('A' + cellIndex).style.border = {top: { style: 'thin' },bottom: { style: 'thin' },left: { style: 'thin' },right: { style: 'thin' },};
          cellIndex++
        });
      }

      worksheet.columns[0].width = 50;
      worksheet.columns[1].width = 50;
      worksheet.getRow(1).height = 30;
  
      workbook.xlsx.writeBuffer().then((buffer) => {
        let blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
        // Créez un lien d'ancrage pour le téléchargement du fichier
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        let name = chantier.name + '.xlsx';
        a.download = name;
        a.style.display = 'none'; // Cachez le lien
    
        // Ajoutez le lien d'ancrage au DOM
        document.body.appendChild(a);
    
        // Simulez un clic sur le lien pour déclencher le téléchargement
        a.click();
    
        // Libérez l'URL et supprimez l'élément ancre après le téléchargement
        window.URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      });
    }
  
    return (
      <>
        <NavBar/>
      { chantier == null ?
        <div></div>
        :
        <div className="">
          <h1 className='text-4xl mb-4 p-4 text-center'>{ chantier.name}</h1>
          <div className='grid grid-cols-2 gap-4 mb-5 mt-5'>
            <Link href={`/chantiers/edit/${id}` } type="button" className="text-center text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 rounded-lg text-sm mr-2 mb-2 dark:bg-teal-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-teal-800">modifier le chantier</Link>
              <button type="button" onClick={() => changeFinishedStatus()} 
              className="text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 rounded-lg text-sm mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-blue-800">
                {chantier.isFinished ? "rouvrir le chantier" : "terminer le chantier"}
                </button>
          </div>

          <table className="w-full border-collapse border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-teal-800 dark:bg-gray-700 p-3 dark:text-gray-400">
                <tr>
                  <th>
                    Informations Générales 
                  </th>
                  <th>
                  </th>
                </tr>
            </thead>
            <tbody>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Adresse
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {chantier.address}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Quoi
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {chantier.type}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Budget
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {chantier.budget}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Nombre heures total
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {Math.round(chantier.totalHours)}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Nombre heures restante
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {Math.round(chantier.availableHours)}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Nombre heures utilisés
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  {Math.round(chantier.usedHours)}
                </td>
              </tr>
              <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                <th className=" font-medium text-gray-900 dark:text-white">
                  Chantier Terminé
                </th>
                <td className="text-left font-medium text-gray-900 dark:text-white">
                  { chantier.isFinished ? "oui" : "non"}
                </td>
              </tr>
            </tbody>
          </table>

          <table className="mt-3 w-full border-collapse border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-teal-800 dark:bg-gray-700 p-3 dark:text-gray-400">
                <tr>
                  <th>
                    Répartitions des heures
                  </th>
                  <th>
                  </th>
                </tr>
            </thead>
            <tbody>
              { tasks.map((task) =>(
                <>
                {task.hours != 0 ? 
                  <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                  <th className="text-center font-medium text-gray-900 dark:text-white">
                    {task.task}
                  </th>
                  <td className="text-left font-medium text-gray-900 dark:text-white">
                    {task.hours}
                  </td>
                </tr> :
                <></>
                }
                </>
              ))}
            </tbody>
          </table>

          <table className="mt-3 w-full border-collapse border border-slate-400 text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase bg-teal-800 dark:bg-gray-700 p-3 dark:text-gray-400">
                <tr>
                  <th>
                    ouvriers ayant participé
                  </th>
                  <th>
                    nombre d'heures travaillé
                  </th>
                </tr>
            </thead>
            <tbody>
              { workers.map((worker) =>(
                <tr className="bg-slate-300 border-b dark:bg-gray-400 dark:border-gray-700">
                  <th className="text-center font-medium text-gray-900 dark:text-white">
                    { worker.name }
                  </th>
                  <td className="text-left font-medium text-gray-900 dark:text-white">
                  { worker.workedHours }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

            <div className="ml-3 mt-5 text-md font-bold mb-3">Note</div>
            {chantier.notes.map((note) =>(
              <div className="w-full grid grid-cols-12 border border-teal-800 p-1 mt-1 rounded">
                <div className="col-span-11">{note}</div>
                <a onClick={() => deleteNote(note)} className="col-span-1"><FaTrashAlt className="text-red-800"/></a>                             
              </div>
            ))}
            
            <textarea id="message" rows="4" className="mt-3 placeholder-teal-800 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
            placeholder="votre note..."
            value={newNote} onChange={(e) => setNewNote(e.target.value)} 
            ></textarea>
            <button type="button" onClick={() => addNote()} className="float-right p-2 text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:ring-teal-300 rounded-lg text-sm mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-teal-700 focus:outline-none dark:focus:ring-blue-800"
              >ajouter une note
            </button>
          <br/>
          <br/>
          <br/>
          <div className="w-full flex flex-col items-center mt-5">          
            <button onClick={downloadExcel} className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-900'>
              exporter excel
            </button>
          </div>
          <br/>
          <br/>
          <div className="w-full flex flex-col items-center mt-5">    
            <button onClick={() => deleteChantier()} className="text-center bottom-0 mt-5 mb-5 bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded">
              supprimer le chantier
            </button>
          </div>
        </div>
      }
    </>
    );
  }