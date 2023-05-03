import { asyncHandler } from "../../../services/asyncHandler.js";
import {
  create,
  find,
  findById,
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
} from "../../../../Database/DBMethods.js";
import { roomModel } from "../../../../Database/model/room.model.js";
import { bookingModel } from "../../../../Database/model/booking.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { workSpaceModel } from "../../../../Database/model/workSpace.model.js";
import reviewModel from "../../../../Database/model/review.model.js";


// workingspace/room/booking

export const getWsRooms = asyncHandler(async (req, res, next) => {
  const cursor = await workSpaceModel.find().cursor();
  let allWorkspaces = [];
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    let room = await find({
      model: roomModel,
      condition: { workspaceId: doc._id },
    });
    let newObj = doc.toObject(); // doc heya kol ws 3ndi 7wltaha l newObj 3shan hea json , wl newObj da b2a el array bta3 el room el 7b3to lel ws
    newObj.room = room;
    allWorkspaces.push(newObj);
  }
  res.json({ message: "Done", allWorkspaces });
});

// get a list of ws from db
export const getWorkSpaces = asyncHandler(async (req, res, next) => {
  let workSpace = await find({ model: workSpaceModel });
  res.status(200).json({ message: "Done", workSpace });
});

export const getBookingHistoryToWs = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  const History = await find({
    model: bookingModel,
    "room.workingSpace": workspaceId,
  });
  res.status(200).json({ message: "Done", History });
});

<<<<<<< HEAD
// //MahmoudTry
// // export const feedback=asyncHandler( async (req, res, next) => {
// //     const workspaceId = req.params.id;
// //     const feedback = req.body.feedback;

// //       const workspace = await workSpaceModel.findById(workspaceId);

// //       workspace.feedback.push(feedback);
// //       await workspace.save();

// <<<<<<< HEAD
//       res.status(200).json(workspace);

//   }); //3amel function 3ashan el feedback yet3amal men ay user w yet3amalo save fel model automatic
//   // mesh e7na elly no7oto w e7na bene3mel create lel workspace





  
// //Maryam Try
// export const createReview = asyncHandler(async (req, res, next) => {
//   let { workspaceId } = req.params;
//   let {rating } = req.body;

//   const workspace = await findById({ model: workSpaceModel, id: workspaceId });
//   if (!workspace) {
//     res.status(404).json({ message: "Workspace not found" });
//   } else {
//     req.body.createdBy = req.user._id;
//     req.body.rating=rating
//     const review = await create({
//       model: reviewModel,
//       data:{
//         createdBy:req.user._id,
//         workspace:workspaceId,
//         rating
//       }
//     });

//     res.status(201).json({ message: "Created" ,review});
//   }
// });
// =======
// //       res.status(200).json(workspace);
// >>>>>>> 2ee649f0ff30f0a6899ea75f464b0eb33f9bc14b

// //});
// //3amel function 3ashan el feedback yet3amal men ay user w yet3amalo save fel model automatic
// // mesh e7na elly no7oto w e7na bene3mel create lel workspace

// //Maryam Try 






=======
>>>>>>> b4661c831477a1f5d0189fe864fc26e84c6c8b1a

export const createReview = asyncHandler(async (req, res, next) => {
  let { workspaceId } = req.params;
  let { rating } = req.body;

  const workspace = await findById({ model: workSpaceModel, id: workspaceId });
  if (!workspace) {
    res.status(404).json({ message: "Workspace not found" });
  } else{
    const existingReview= await findOne({ model: reviewModel ,
      condition:{
      createdBy:req.user._id,
      workspace:workspaceId,
    }});
    if(existingReview){
      res.status(401).json({message:"Sorry,you can only add one review per workspace"})
    }else{
      const review = await create({
        model: reviewModel,
        data: {
          createdBy:req.user._id,
          workspace: workspaceId,
          rating},
        });
        res.status(201).json({ message: "Created" ,review});}
      }
      });
    
    


//try salma
export const avgRate=asyncHandler(async(req,res,next)=>{
  let {workspaceId}=req.params
  const Workspace=await findById({model:workSpaceModel,id:workspaceId})
  if(!Workspace){
res.status(404).json({message:"Workspace not found"})
  }else{
    const reviews = await find({model:reviewModel,condition:{workspace:workspaceId}})
    const totalReviews=reviews.length
    // initial Counter
    let totalRating=0;
    for (let i = 0; i < totalReviews; i++) {
      totalRating += reviews[i].rating;
    }
    const avgRating=totalRating/totalReviews
<<<<<<< HEAD
    const avgRate= await findByIdAndUpdate({model:workSpaceModel,condition:{_id:workspaceId},data:{avgRate:avgRating}})
=======
    //  const WorkspaceAvg=await findByIdAndUpdate({model:workSpaceModel,condition:{_id:workspaceId},data:{avgRate:avgRating}})     
>>>>>>> b4661c831477a1f5d0189fe864fc26e84c6c8b1a
    res.status(200).json({message:"Done",avgRating})
  }
})

export const searchByRate = asyncHandler(async (req, res, next) => {
  let {rate}=req.params;
  const WsRate=await find({model:reviewModel,condition:{rating:rate}})
  if(WsRate.length){
    res.status(200).json({ message: "founded",WsRate})
  }else{
    res.status(404).json({message:"not founded WorkSpace have this rate"})
  }});


// function Descsort(a,b){
//   return b-a;
//}
  
 export const HighestRate = asyncHandler(async (req, res, next) => {
   const HRate=await find({model:workSpaceModel,select:"avgRate"})
   console.log(HRate);
   if(avgRate<HRate){
    res.status
  }else{
    res.status(404).json({message:"not founded WorkSpace have this rate"})
  }});




