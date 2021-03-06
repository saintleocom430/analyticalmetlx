package com.metl.model

import com.metl.utils.{Stopwatch,SynchronizedWriteMap}
import com.metl.comet.ReputationServer
import scala.collection.mutable.{HashMap, SynchronizedMap}
import net.liftweb.common.Logger

case class Standing(who:String,formative:Int,summative:Int)
object Reputation extends Logger{
  private val standingMap = new SynchronizedWriteMap[String,Int]{
    override def default(who:String):Int = {
      syncWrite(()=>{
        val newStanding = Informal.standing(who)
        this += (who -> newStanding)
        newStanding
      })
    }
  }
  def allStandings:List[Standing] = Stopwatch.time("Reputation:allStandings",standingMap.map(st => Standing(st._1,st._2,0)).filter(a => a.isInstanceOf[Standing]).map(a => a.asInstanceOf[Standing]).toList)
  def populateStandingMap:Unit = Stopwatch.time("Reputation:populateStandingMap",{
    Informal.findAll.foreach(i => addStanding(i.protagonist.get,i.action.get))
    debug("populated standingMap: %s".format(standingMap))
  })
  def standing(who:String):Standing = Standing(who,standingMap(who),0)
  def addStanding(who:String,what:GainAction.Value):Unit = Stopwatch.time("Reputation:addStanding(%s,%s)".format(who,what),{
    val score = Informal.value(what)
    if (score > 0){
      val currentStanding = standingMap(who)
      val newScore = currentStanding + score
      standingMap(who) = newScore
      ReputationServer ! Standing(who,newScore,0)
    }
  })
  def addStandingToMap(who:String,howMuch:Int):Unit = standingMap(who) = standingMap(who) + howMuch
  val reciprocalActions = List(GainAction.VotedUp,GainAction.VotedDown,GainAction.MadeAnswerOnStack,GainAction.MadeCommentOnStack,GainAction.ViewedQuestionOnStack,GainAction.ViewedAnswerOnStack,GainAction.ViewedCommentOnStack)
  def accrue(gain:Informal)= Stopwatch.time("Reputation.accrue(%s)".format(gain),{
    val gainAction = gain.action.get
    if (reciprocalActions.contains(gainAction)){
      val recRep = Informal.createRecord
      val reciprocatingRep = gainAction match {
        case GainAction.VotedUp => recRep.action(GainAction.ReceivedUpVote)
        case GainAction.VotedDown => recRep.action(GainAction.ReceivedDownVote)
        case GainAction.MadeAnswerOnStack => recRep.action(GainAction.ReceivedAnswerOnStack)
        case GainAction.MadeCommentOnStack => recRep.action(GainAction.ReceivedCommentOnStack)
        case GainAction.ViewedQuestionOnStack => recRep.action(GainAction.ReceivedQuestionViewOnStack)
        case GainAction.ViewedAnswerOnStack => recRep.action(GainAction.ReceivedAnswerViewOnStack)
        case GainAction.ViewedCommentOnStack => recRep.action(GainAction.ReceivedCommentViewOnStack)
      }
      val finalRecRep = reciprocatingRep.protagonist(gain.antagonist.get).antagonist(gain.protagonist.get).time(gain.time.get).conversation(gain.conversation.get).save(true)
      addStanding(finalRecRep.protagonist.get,finalRecRep.action.get)
      gain.save(true)
      ReputationServer ! List(finalRecRep,gain)
    }
    else {
      gain.save(true)
      ReputationServer ! gain
    }
  })
  def value(action:Informal)=Informal.value(action.action.get)
}
